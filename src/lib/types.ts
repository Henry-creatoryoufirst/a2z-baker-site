export interface Review {
  id: string
  name: string
  message: string
  rating: number
  approved: boolean
  created_at: string
}

export interface Order {
  id: string
  name: string
  email: string
  phone: string | null
  order_details: string
  date_needed: string | null
  allergies: string | null
  status: 'new' | 'confirmed' | 'completed' | 'cancelled'
  admin_notes: string | null
  created_at: string
}

export interface SubscriptionClub {
  id: string
  name: string
  description: string
  price: number
  frequency: 'weekly' | 'biweekly' | 'monthly'
  items: string[]
  image_url: string | null
  active: boolean
  created_at: string
}

export interface SubscriptionSignup {
  id: string
  club_id: string
  name: string
  email: string
  phone: string | null
  created_at: string
  club?: SubscriptionClub
}

export interface MerchOrder {
  id: string
  printful_order_id: string | null
  stripe_payment_id: string | null
  customer_email: string
  customer_name: string
  items: Record<string, unknown>[]
  total_cents: number
  status: string
  shipping_address: Record<string, unknown>
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  created_at: string
}
