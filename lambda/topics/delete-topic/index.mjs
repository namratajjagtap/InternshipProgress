import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

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
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  }
}

function getTopicId(event) {
  return event?.pathParameters?.id || event?.pathParameters?.topicId || ''
}

export const handler = async (event) => {
  if (event?.requestContext?.http?.method === 'OPTIONS') {
    return response(200, { ok: true })
  }

  try {
    const topicId = String(getTopicId(event)).trim()
    if (!topicId) {
      return response(400, { message: 'Topic id is required' })
    }

    await ddb.send(
      new DeleteCommand({
        TableName: TABLE_NAME,
        Key: { id: topicId },
        ConditionExpression: 'attribute_exists(id)'
      })
    )

    return response(200, { message: 'Topic deleted', id: topicId })
  } catch (error) {
    if (error?.name === 'ConditionalCheckFailedException') {
      return response(404, { message: 'Topic not found' })
    }

    console.error('delete-topic error:', error)
    return response(500, { message: 'Failed to delete topic' })
  }
}
