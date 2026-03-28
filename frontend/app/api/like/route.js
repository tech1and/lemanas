import { NextResponse } from 'next/server'
import api from '@/lib/api'

/**
 * Прокси для лайков (защита от CORS)
 */
export async function POST(request) {
  try {
    const body = await request.json()
    const { data } = await api.post(`/products/${body.productId}/like/`, {
      city_id: body.cityId
    })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Like failed' }, 
      { status: 500 }
    )
  }
}