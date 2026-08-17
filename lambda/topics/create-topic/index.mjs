import { randomBytes } from 'node:crypto'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({})
const ddb = DynamoDBDocumentClient.from(client)

const TABLE_NAME = process.env.TABLE_NAME || 'Topics'

function response(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
    },
    body: JSON.stringify(body)
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export const handler = async (event) => {
  if (event?.requestContext?.http?.method === 'OPTIONS') {
    return response(200, { ok: true })
  }

  try {
    const parsedBody =
      typeof event?.body === 'string' ? JSON.parse(event.body) : event?.body || {}

    const title = (parsedBody.title || '').trim()
    const category = (parsedBody.category || '').trim()
    const outcome = (parsedBody.outcome || '').trim()
    const highlights = Array.isArray(parsedBody.highlights)
      ? parsedBody.highlights.map((h) => String(h).trim()).filter(Boolean)
      : []

    if (!title || !category || !outcome || highlights.length === 0) {
      return response(400, {
        message: 'title, category, outcome and at least one highlight are required'
      })
    }

    const dayValue = Number(parsedBody.day)
    const createdAt = new Date().toISOString()
    const baseId = slugify(title) || 'topic'
    const id = `${baseId}-${randomBytes(3).toString('hex')}`

    const item = {
      id,
      title,
      category,
      highlights,
      outcome,
      createdAt,
      day: Number.isFinite(dayValue) ? dayValue : undefined
    }

    await ddb.send(
      new PutCommand({
        TableName: TABLE_NAME,
        Item: item
      })
    )

    return response(201, item)
  } catch (error) {
    console.error('create-topic error:', error)
    return response(500, { message: 'Failed to create topic' })
  }
}
