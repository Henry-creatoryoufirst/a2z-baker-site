import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getAdminFromCookie } from '@/lib/auth'

// Public: submit an order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, order_details, date_needed, allergies } = body

    if (!name || !email || !order_details) {
      return NextResponse.json({ error: 'Name, email, and order details required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { error } = await supabase.from('orders').insert({
      name,
      email,
      phone: phone || null,
      order_details,
      date_needed: date_needed || null,
      allergies: allergies || null,
      status: 'new',
    })

    if (error) {
      console.error('Order insert error:', error)
      return NextResponse.json({ error: 'Failed to submit order' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Admin: list orders
export async function GET() {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Admin: update order status/notes
export async function PATCH(request: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status, admin_notes } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const updates: Record<string, unknown> = {}
    if (status) updates.status = status
    if (admin_notes !== undefined) updates.admin_notes = admin_notes

    const { error } = await supabase.from('orders').update(updates).eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
