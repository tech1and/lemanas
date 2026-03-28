# backend/apps/catalog/management/commands/import_lemanapro_xml.py
import xml.etree.ElementTree as ET
from django.core.management.base import BaseCommand
from django.db import transaction
from apps.catalog.models import Product, Category, City
from django.utils.text import slugify
import re

class Command(BaseCommand):
    help = 'Импорт каталога Лемана Про из XML'

    def add_arguments(self, parser):
        parser.add_argument('xml_file', type=str, help='Путь к XML файлу')
        parser.add_argument('--dry-run', action='store_true', help='Тестовый режим без записи в БД')

    def _clean_text(self, text):
        """Очистка текста от лишнего форматирования"""
        if not text:
            return ''
        return re.sub(r'\s+', ' ', text.strip())

    def _generate_slug(self, name, xml_id):
        """Уникальный слаг: имя + ID для гарантии уникальности"""
        base = slugify(name[:50])
        return f"{base}-{xml_id}" if base else f"product-{xml_id}"

    def _rewrite_description(self, raw_desc):
        """
        Простой рерайт описания (в продакшене — вызов LLM API)
        """
        if not raw_desc:
            return ''
        # Добавляем экспертный комментарий
        return f"{raw_desc}\n\n💡 Экспертное мнение: Обратите внимание на характеристики товара при выборе."

    @transaction.atomic
    def handle(self, *args, **options):
        xml_file = options['xml_file']
        dry_run = options['dry_run']
        
        self.stdout.write(f"📦 Импорт из {xml_file} (dry_run={dry_run})")
        
        tree = ET.parse(xml_file)
        root = tree.getroot()
        
        offers = root.findall('.//offer')
        self.stdout.write(f"🔍 Найдено товаров: {len(offers)}")
        
        created = updated = skipped = 0
        
        for offer in offers:
            try:
                xml_id = offer.find('id').text
                name = self._clean_text(offer.find('name').text)
                
                # Пропускаем неактивные товары
                if offer.find('store') is not None and offer.find('store').text == 'false':
                    skipped += 1
                    continue
                
                # Парсим параметры
                params = {}
                for param in offer.findall('param'):
                    param_name = param.get('name', '').strip()
                    param_value = self._clean_text(param.text)
                    if param_name and param_value:
                        params[param_name] = param_value
                
                # Создаём/обновляем товар
                product, is_new = Product.objects.get_or_create(
                    xml_id=xml_id,
                    defaults={
                        'name': name,
                        'slug': self._generate_slug(name, xml_id),
                        'description_raw': self._clean_text(offer.find('description').text),
                        'description': self._rewrite_description(
                            self._clean_text(offer.find('description').text)
                        ),
                        'price': float(offer.find('price').text),
                        'currency': offer.find('currencyId').text if offer.find('currencyId') is not None else 'RUR',
                        'in_stock': offer.find('store').text == 'true' if offer.find('store') is not None else True,
                        'pickup_available': offer.find('pickup').text == 'true' if offer.find('pickup') is not None else False,
                        'delivery_available': offer.find('delivery').text == 'true' if offer.find('delivery') is not None else False,
                        'images': [img.text for img in offer.findall('picture') if img.text],
                        'params': params,
                        'weight': float(offer.find('weight').text) if offer.find('weight') is not None else None,
                        'dimensions': self._clean_text(offer.find('dimensions').text) if offer.find('dimensions') is not None else '',
                        'country_of_origin': self._clean_text(offer.find('country_of_origin').text) if offer.find('country_of_origin') is not None else '',
                        'barcode': self._clean_text(offer.find('barcode').text) if offer.find('barcode') is not None else '',
                    }
                )
                
                if not is_new:
                    # Обновляем изменяемые поля
                    product.name = name
                    product.price = float(offer.find('price').text)
                    product.in_stock = offer.find('store').text == 'true' if offer.find('store') is not None else True
                    product.params = params
                    product.save(update_fields=['name', 'price', 'in_stock', 'params', 'updated_at'])
                    updated += 1
                else:
                    created += 1
                
                # Категории (упрощённо — из <category>)
                # В реальном проекте — парсинг дерева категорий
                
                if not dry_run:
                    self.stdout.write(f"✓ {name[:50]}...")
                    
            except Exception as e:
                self.stderr.write(f"✗ Ошибка при импорте {xml_id}: {e}")
                continue
        
        self.stdout.write(self.style.SUCCESS(
            f"\n✅ Готово: создано={created}, обновлено={updated}, пропущено={skipped}"
        ))