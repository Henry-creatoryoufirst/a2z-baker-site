import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getAdminFromCookie } from '@/lib/auth'

// Public: get approved reviews
export async function GET() {
  const supabase = getServiceClient()
  const { data, error } = await supabase
    .from('reviews')
    .select('id, name, message, rating, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Public: submit a review
export async function POST(request: NextRequest) {
  try {
    const { name, message, rating } = await request.json()

    if (!name || !message || !rating) {
      return NextResponse.json({ error: 'Name, message, and rating required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { error } = await supabase.from('reviews').insert({
      name,
      message,
      rating: Math.min(5, Math.max(1, Number(rating))),
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Admin: update or delete reviews
export async function PATCH(request: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, approved } = await request.json()
    const supabase = getServiceClient()

    const { error } = await supabase
      .from('reviews')
      .update({ approved })
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to update review' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Review ID required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { error } = await supabase.from('reviews').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
