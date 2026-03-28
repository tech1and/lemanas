'use client'

import { useState } from 'react'
import api from '@/lib/api'

/**
 * Хук для лайка товара
 * @param {number} productId
 */
export function useProductLike(productId) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleLike = async () => {
    if (loading) return
    
    setLoading(true)
    try {
      const { data } = await api.post(`/products/${productId}/like/`)
      setLikesCount(data.likes_count)
      setLiked(true)
    } catch (error) {
      console.error('Like error:', error)
    } finally {
      setLoading(false)
    }
  }

  return { liked, likesCount, loading, handleLike }
}