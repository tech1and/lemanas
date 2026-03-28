import Link from 'next/link'

/**
 * Хлебные крошки с микроразметкой
 * @param {{ items: Array<{label: string, href: string}> }} props
 */
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li 
            key={item.href} 
            className="breadcrumb-item"
            itemScope 
            itemType="https://schema.org/ListItem"
            itemProp={`itemListElement${index}`}
          >
            <Link 
              href={item.href} 
              itemProp="item"
              className={index === items.length - 1 ? 'text-decoration-none text-dark' : 'text-decoration-none'}
              aria-current={index === items.length - 1 ? 'page' : undefined}
            >
              <span itemProp="name">{item.label}</span>
            </Link>
            <meta itemProp="position" content={index + 1} />
          </li>
        ))}
      </ol>
    </nav>
  )
}