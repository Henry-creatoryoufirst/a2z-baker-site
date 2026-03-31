import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getAdminFromCookie } from '@/lib/auth'

// Public: get active subscription clubs
export async function GET() {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('subscription_clubs')
    .select('*')
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch clubs' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Admin: create a subscription club
export async function POST(request: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { name, description, price, frequency, items, image_url } = body

    if (!name || !description || !price || !frequency) {
      return NextResponse.json({ error: 'Name, description, price, and frequency required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { data, error } = await supabase
      .from('subscription_clubs')
      .insert({
        name,
        description,
        price: Number(price),
        frequency,
        items: items || [],
        image_url: image_url || null,
        active: true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to create club' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Admin: update a subscription club
export async function PUT(request: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Club ID required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { error } = await supabase
      .from('subscription_clubs')
      .update(updates)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to update club' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Admin: delete a subscription club
export async function DELETE(request: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Club ID required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { error } = await supabase
      .from('subscription_clubs')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete club' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
