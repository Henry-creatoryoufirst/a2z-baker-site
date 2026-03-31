import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { comparePassword, signToken, getTokenCookieOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { data: user, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email.toLowerCase())
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const valid = await comparePassword(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ userId: user.id, email: user.email })
    const cookieOptions = getTokenCookieOptions()

    const response = NextResponse.json({ success: true })
    response.cookies.set(cookieOptions.name, token, cookieOptions)

    return response
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieOptions = getTokenCookieOptions()
  const response = NextResponse.json({ success: true })
  response.cookies.set(cookieOptions.name, '', { ...cookieOptions, maxAge: 0 })
  return response
}
