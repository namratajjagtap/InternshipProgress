import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb'

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

export const handler = async (event) => {
  if (event?.requestContext?.http?.method === 'OPTIONS') {
    return response(200, { ok: true })
  }

  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: TABLE_NAME
      })
    )

    const items = (result.Items || []).sort((a, b) => {
      const aTime = a.createdAt || ''
      const bTime = b.createdAt || ''
      return bTime.localeCompare(aTime)
    })

    return response(200, items)
  } catch (error) {
    console.error('get-topics error:', error)
    return response(500, { message: 'Failed to fetch topics' })
  }
}
