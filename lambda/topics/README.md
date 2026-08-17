# Topics Backend Lambdas

This folder contains Lambda handlers for topics used by the frontend app.

## Functions

- `get-topics/index.mjs` -> read all topics from DynamoDB table
- `create-topic/index.mjs` -> validate and store a new topic in DynamoDB table
- `delete-topic/index.mjs` -> delete one topic by id from DynamoDB table

## Environment variable

Set this on both Lambda functions:

- `TABLE_NAME=Topics`

## API Gateway routes

- `GET /topics` -> `get-topics`
- `POST /topics` -> `create-topic`
- `DELETE /topics/{id}` -> `delete-topic`

## Test event for get-topics

```json
{}
```

## Test event for create-topic

```json
{
  "body": "{\"title\":\"Vue Slots\",\"category\":\"Vue.js\",\"highlights\":[\"default slot\",\"named slot\"],\"outcome\":\"Built reusable card layouts\"}"
}
```
