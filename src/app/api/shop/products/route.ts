import { NextRequest, NextResponse } from 'next/server'
import { getProducts, getProduct, isConfigured } from '@/lib/printful'

export async function GET(request: NextRequest) {
  try {
    if (!isConfigured()) {
      return NextResponse.json(
        { message: 'Merch shop is not configured yet. Please set up your Printful API key.', products: [] },
        { status: 200 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    // Single product with variants
    if (id) {
      const product = await getProduct(Number(id))
      return NextResponse.json(product, {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
      })
    }

    // All products
    const products = await getProducts()

    // Enrich each product with its lowest price by fetching variants
    const enriched = await Promise.all(
      products.map(async (p) => {
        try {
          const full = await getProduct(p.id)
          const prices = full.sync_variants.map(v => parseFloat(v.retail_price)).filter(v => !isNaN(v))
          const lowestPrice = prices.length > 0 ? Math.min(...prices) : null
          return {
            id: p.id,
            name: p.name,
            thumbnail_url: p.thumbnail_url,
            variants: p.variants,
            price: lowestPrice?.toFixed(2) || null,
          }
        } catch {
          return {
            id: p.id,
            name: p.name,
            thumbnail_url: p.thumbnail_url,
            variants: p.variants,
            price: null,
          }
        }
      })
    )

    return NextResponse.json(enriched, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60' },
    })
  } catch (err) {
    console.error('Shop products error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
