import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getAdminFromCookie } from '@/lib/auth'

// Public: sign up for a subscription club
export async function POST(request: NextRequest) {
  try {
    const { club_id, name, email, phone } = await request.json()

    if (!club_id || !name || !email) {
      return NextResponse.json({ error: 'Club ID, name, and email required' }, { status: 400 })
    }

    const supabase = getServiceClient()

    // Verify club exists and is active
    const { data: club } = await supabase
      .from('subscription_clubs')
      .select('id, name')
      .eq('id', club_id)
      .eq('active', true)
      .single()

    if (!club) {
      return NextResponse.json({ error: 'Club not found or inactive' }, { status: 404 })
    }

    // Check for duplicate signup
    const { data: existing } = await supabase
      .from('subscription_signups')
      .select('id')
      .eq('club_id', club_id)
      .eq('email', email.toLowerCase())
      .single()

    if (existing) {
      return NextResponse.json({ error: 'You are already signed up for this club' }, { status: 409 })
    }

    const { error } = await supabase.from('subscription_signups').insert({
      club_id,
      name,
      email: email.toLowerCase(),
      phone: phone || null,
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to sign up' }, { status: 500 })
    }

    return NextResponse.json({ success: true, club_name: club.name })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Admin: get signups (optionally filtered by club_id)
export async function GET(request: NextRequest) {
  const admin = await getAdminFromCookie()
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const clubId = searchParams.get('club_id')

  const supabase = getServiceClient()
  let query = supabase
    .from('subscription_signups')
    .select('*, club:subscription_clubs(id, name)')
    .order('created_at', { ascending: false })

  if (clubId) {
    query = query.eq('club_id', clubId)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch signups' }, { status: 500 })
  }

  return NextResponse.json(data)
}
