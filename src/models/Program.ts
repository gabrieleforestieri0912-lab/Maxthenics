import { getSupabase } from '@/lib/supabase'

export interface IExercise {
  name: string
  sets: number
  reps: string
  rest: string
  notes?: string
}

export interface IProgram {
  id: string
  _id: string
  title: string
  description?: string | null
  level: string
  price: number
  image?: string | null
  stripePriceId?: string | null
  exercises: IExercise[]
  userId?: string | null
  createdAt: string
}

type ProgramRow = {
  id: string
  title: string
  description: string | null
  level: string
  price: number
  image: string | null
  stripe_price_id: string | null
  exercises: IExercise[]
  user_id: string | null
  created_at: string
}

function rowToProgram(row: ProgramRow): IProgram {
  return {
    id: row.id,
    _id: row.id,
    title: row.title,
    description: row.description,
    level: row.level,
    price: row.price,
    image: row.image,
    stripePriceId: row.stripe_price_id,
    exercises: row.exercises ?? [],
    userId: row.user_id,
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db() { return (getSupabase() as any).from('programs') }

async function findAll(): Promise<IProgram[]> {
  const { data, error } = await db().select('*').order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as ProgramRow[]).map(rowToProgram)
}

async function findByUser(userId: string): Promise<IProgram[]> {
  const { data, error } = await db().select('*').eq('user_id', userId).order('created_at', { ascending: false })
  if (error || !data) return []
  return (data as ProgramRow[]).map(rowToProgram)
}

async function create(data: Record<string, unknown>): Promise<IProgram> {
  const row = toRow({ ...data, createdAt: new Date().toISOString() })
  const { data: inserted, error } = await db().insert(row).select().single()
  if (error) throw new Error(`Failed to create program: ${error.message}`)
  return rowToProgram(inserted as ProgramRow)
}

async function remove(id: string): Promise<void> {
  await db().delete().eq('id', id)
}

const Program = {
  findAll,
  find: findAll,
  findByUser,
  create,
  remove,
}

export default Program
