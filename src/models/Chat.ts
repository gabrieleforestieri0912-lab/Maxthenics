import { getSupabase } from '@/lib/supabase'

export interface IMessage {
  role: 'user' | 'assistant'
  content: string
  createdAt?: string
  feedback?: 'up' | 'down' | null
}

export interface IChat {
  id: string
  _id: string
  userId?: string | null
  guestId?: string | null
  title: string
  messages: IMessage[]
  createdAt: string
  updatedAt: string
}

type ChatRow = {
  id: string
  user_id: string | null
  guest_id: string | null
  title: string
  messages: IMessage[]
  created_at: string
  updated_at: string
}

function rowToChat(row: ChatRow): IChat {
  return {
    id: row.id,
    _id: row.id,
    userId: row.user_id,
    guestId: row.guest_id,
    title: row.title,
    messages: row.messages ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
function db() { return (getSupabase() as any).from('chats') }

async function findById(id: string): Promise<IChat | null> {
  const { data, error } = await db().select('*').eq('id', id).single()
  if (error || !data) return null
  return rowToChat(data as ChatRow)
}

async function findByIdAndDelete(id: string): Promise<void> {
  await db().delete().eq('id', id)
}

async function findByIdAndUpdate(id: string, data: Record<string, unknown>): Promise<IChat | null> {
  const row = toRow({ ...data, updatedAt: new Date().toISOString() })
  const { data: updated, error } = await db().update(row).eq('id', id).select().single()
  if (error || !updated) return null
  return rowToChat(updated as ChatRow)
}

async function create(data: Record<string, unknown>): Promise<IChat> {
  const now = new Date().toISOString()
  const row = toRow({ ...data, createdAt: now, updatedAt: now })
  const { data: inserted, error } = await db().insert(row).select().single()
  if (error) throw new Error(`Failed to create chat: ${error.message}`)
  return rowToChat(inserted as ChatRow)
}

async function findAll(
  query: Record<string, unknown>,
  options: { sort?: Record<string, number>; select?: string; limit?: number } = {}
): Promise<IChat[]> {
  let dbQuery = db().select('*')

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) {
      const col = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      dbQuery = dbQuery.eq(col, value)
    }
  }

  if (options.sort) {
    for (const [key, direction] of Object.entries(options.sort)) {
      const col = key.replace(/([A-Z])/g, '_$1').toLowerCase()
      dbQuery = dbQuery.order(col, { ascending: direction === 1 })
    }
  }

  if (options.limit) {
    dbQuery = dbQuery.limit(options.limit)
  }

  const { data, error } = await dbQuery
  if (error || !data) return []
  return (data as ChatRow[]).map(rowToChat)
}

const Chat = {
  findById,
  findByIdAndDelete,
  findByIdAndUpdate,
  create,
  findAll,
  find: findAll,
}

export default Chat
