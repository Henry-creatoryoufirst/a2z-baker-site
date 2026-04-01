const PRINTFUL_API_BASE = 'https://api.printful.com'

function getApiKey(): string | null {
  return process.env.PRINTFUL_API_KEY || null
}

function getStoreId(): string | null {
  return process.env.PRINTFUL_STORE_ID || null
}

function headers(): HeadersInit {
  const key = getApiKey()
  if (!key) throw new Error('PRINTFUL_API_KEY is not set')
  const h: Record<string, string> = {
    'Authorization': `Bearer ${key}`,
    'Content-Type': 'application/json',
  }
  const storeId = getStoreId()
  if (storeId) h['X-PF-Store-Id'] = storeId
  return h
}

async function printfulFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${PRINTFUL_API_BASE}${path}`, {
    headers: headers(),
    next: { revalidate: 300 }, // 5 min cache
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Printful API error ${res.status}: ${text}`)
  }
  const json = await res.json()
  return json.result as T
}

// --- Types ---

export interface PrintfulSyncProduct {
  id: number
  external_id: string
  name: string
  variants: number
  synced: number
  thumbnail_url: string
  is_ignored: boolean
}

export interface PrintfulSyncVariant {
  id: number
  external_id: string
  sync_product_id: number
  name: string
  synced: boolean
  variant_id: number
  retail_price: string
  currency: string
  is_ignored: boolean
  sku: string
  product: {
    variant_id: number
    product_id: number
    image: string
    name: string
  }
  files: PrintfulFile[]
}

export interface PrintfulFile {
  id: number
  type: string
  hash: string
  url: string | null
  filename: string
  mime_type: string
  size: number
  width: number
  height: number
  dpi: number | null
  status: string
  created: number
  thumbnail_url: string
  preview_url: string
  visible: boolean
}

export interface PrintfulSyncProductFull {
  sync_product: PrintfulSyncProduct
  sync_variants: PrintfulSyncVariant[]
}

export interface PrintfulShippingRate {
  id: string
  name: string
  rate: string
  currency: string
  minDeliveryDays: number
  maxDeliveryDays: number
  minDeliveryDate: string
  maxDeliveryDate: string
}

export interface PrintfulAddress {
  name: string
  address1: string
  city: string
  state_code: string
  country_code: string
  zip: string
}

export interface PrintfulShippingItem {
  variant_id: number
  quantity: number
}

// --- API Functions ---

export async function getProducts(): Promise<PrintfulSyncProduct[]> {
  const key = getApiKey()
  if (!key) return []
  return printfulFetch<PrintfulSyncProduct[]>('/store/products')
}

export async function getProduct(id: number): Promise<PrintfulSyncProductFull> {
  return printfulFetch<PrintfulSyncProductFull>(`/store/products/${id}`)
}

export async function getProductVariants(id: number): Promise<PrintfulSyncVariant[]> {
  const product = await getProduct(id)
  return product.sync_variants
}

export async function estimateShipping(
  items: PrintfulShippingItem[],
  address: PrintfulAddress
): Promise<PrintfulShippingRate[]> {
  const key = getApiKey()
  if (!key) throw new Error('PRINTFUL_API_KEY is not set')

  const res = await fetch(`${PRINTFUL_API_BASE}/shipping/rates`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      recipient: address,
      items,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Printful shipping estimate error ${res.status}: ${text}`)
  }

  const json = await res.json()
  return json.result as PrintfulShippingRate[]
}

export function isConfigured(): boolean {
  return !!getApiKey()
}
