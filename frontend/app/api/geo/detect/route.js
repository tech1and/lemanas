import { NextResponse } from 'next/server'

/**
 * Определение города по IP
 */
export async function GET(request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             '127.0.0.1'

  // В продакшене — вызов сервиса геолокации (Sypex Geo, MaxMind)
  // Здесь — заглушка для примера
  const mockCity = {
    id: 1,
    name: 'Москва',
    slug: 'moskva',
    latitude: 55.7558,
    longitude: 37.6173
  }

  return NextResponse.json({ city: mockCity, ip })
}