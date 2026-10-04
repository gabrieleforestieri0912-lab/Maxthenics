import { getSupabase } from '@/lib/supabase'

export interface IUser {
  id: string
  _id: string
  name: string
  email: string
  password?: string | null
  avatar?: string | null
  provider: string
  googleId?: string | null
  stripeCustomerId?: string | null
  subscriptionStatus: string
  subscriptionTier: string
  purchases: string[]
  createdAt: string
}

type UserRow = {
  id: string
  name: string
  email: string
  password: string | null
  avatar: string | null
  provider: string
  google_id: string | null
  stripe_customer_id: string | null
  subscription_status: string
  subscription_tier: string
  purchases: string[]
  created_at: string
}

function rowToUser(row: UserRow): IUser {
  return {
    id: row.id,
    _id: row.id,
    name: row.name,
    email: row.email,
    password: row.password,
    avatar: row.avatar,
    provider: row.provider,
    googleId: row.google_id,
    stripeCustomerId: row.stripe_customer_id,
    subscriptionStatus: row.subscription_status,
    subscriptionTier: row.subscription_tier,
    purchases: row.purchases ?? [],
    createdAt: row.created_at,
  }
}

function toRow(data: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(data)) {
    if (key === '_id' || key === 'id') continue
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase()
    row[snakeKey] = value
  }
  return row
}

function db() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (getSupabase() as any).from('users')
}

async function findById(id: string, exclude?: string): Promise<IUser | null> {
  const { data, error } = await db().select('*').eq('id', id).single()
  if (error || !data) return null
  const user = rowToUser(data as UserRow)
  if (exclude) {
    const excluded = exclude.replace('-', '')
    delete (user as unknown as Record<string, unknown>)[excluded]
  }
  return user
}

async function findOne(filter: Record<string, unknown>): Promise<IUser | null> {
  let query = db().select('*')

  if (filter.$or && Array.isArray(filter.$or)) {
    const orConditions = filter.$or.map((cond: Record<string, unknown>) =>
      Object.entries(cond)
        .map(([k, v]) => `${toSnakeKey(k)}.eq.${v}`)
        .join(',')
    ).join(',')
    query = query.or(orConditions)
  } else {
    for (const [key, value] of Object.entries(filter)) {
      if (key === '$or') continue
      query = query.eq(toSnakeKey(key), value)
    }
  }

  const { data, error } = await query.maybeSingle()
  if (error || !data) return null
  return rowToUser(data as UserRow)
}

function toSnakeKey(key: string): string {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase()
}

async function create(data: Record<string, unknown>): Promise<IUser> {
  const row = toRow({ ...data, createdAt: new Date().toISOString() })
  const { data: inserted, error } = await db().insert(row).select().single()
  if (error) throw new Error(`Failed to create user: ${error.message}`)
  return rowToUser(inserted as UserRow)
}

async function findByIdAndUpdate(id: string, data: Record<string, unknown>): Promise<void> {
  const row = toRow(data)
  const { error } = await db().update(row).eq('id', id)
  if (error) throw new Error(`Failed to update user: ${error.message}`)
}

const User = {
  findById,
  findOne,
  create,
  findByIdAndUpdate,
}

export default User
