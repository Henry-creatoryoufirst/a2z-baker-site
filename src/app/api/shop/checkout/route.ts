import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

interface CheckoutItem {
  variantId: number
  productName: string
  variantName: string
  price: number
  quantity: number
  imageUrl: string
}

interface CheckoutBody {
  items: CheckoutItem[]
  shipping: {
    name: string
    email: string
    address1: string
    city: string
    state: string
    zip: string
    country: string
  }
  totalCents: number
}

export async function POST(request: NextRequest) {
  try {
    const body: CheckoutBody = await request.json()

    const { items, shipping, totalCents } = body

    // Validate required fields
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }
    if (!shipping?.name || !shipping?.email || !shipping?.address1 || !shipping?.city || !shipping?.state || !shipping?.zip) {
      return NextResponse.json({ error: 'All shipping fields are required' }, { status: 400 })
    }

    const supabase = getServiceClient()

    const { data, error } = await supabase
      .from('merch_orders')
      .insert({
        customer_name: shipping.name,
        customer_email: shipping.email,
        items: items,
        total_cents: totalCents,
        status: 'pending',
        shipping_address: {
          name: shipping.name,
          address1: shipping.address1,
          city: shipping.city,
          state: shipping.state,
          zip: shipping.zip,
          country: shipping.country,
        },
      })
      .select()
      .single()

    if (error) {
      console.error('Merch order insert error:', error)
      return NextResponse.json({ error: 'Failed to save order' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      message: 'Order placed successfully. Payment integration coming soon.',
    })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
