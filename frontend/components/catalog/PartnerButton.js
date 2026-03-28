'use client'

import { useState } from 'react'
import { trackPartnerClick } from '@/lib/partner'
import { useGeoLocation } from '@/hooks/useGeoLocation'

/**
 * Кнопка перехода на сайт партнёра с трекингом
 * @param {{ 
 *   productId: number, 
 *   productXmlId: string, 
 *   basePartnerUrl: string, 
 *   cityId?: number, 
 *   price?: number 
 * }} props 
 */
export function PartnerButton({ 
  productId, 
  productXmlId, 
  basePartnerUrl,
  cityId,
  price 
}) {
  const [loading, setLoading] = useState(false)
  const { city } = useGeoLocation()

  const handleClick = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const { redirect_url } = await trackPartnerClick({
        productId,
        cityId: cityId || city?.id,
        price,
        clickId: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })
      
      setTimeout(() => {
        window.location.href = redirect_url
      }, 150)
      
    } catch (error) {
      console.error('Tracking error:', error)
      window.location.href = basePartnerUrl
    }
  }

  return (
    <a
      href={basePartnerUrl}
      onClick={handleClick}
      className="btn btn-primary btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
      rel="sponsored noopener noreferrer"
      aria-label={`Купить ${productXmlId} на официальном сайте Лемана Про`}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm" role="status" />
      ) : (
        <>
          <i className="bi bi-cart-check" />
          Проверить цену и наличие →
        </>
      )}
      <small className="d-block text-muted mt-1" style={{fontSize: '0.75rem'}}>
        *Партнёрская ссылка
      </small>
    </a>
  )
}