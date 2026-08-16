import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

const cloudFront = new CloudFrontClient({});

export const handler = async (event) => {
  const body = typeof event === "string" ? JSON.parse(event) : event;

  const distributionId = body?.distributionId;
  const paths = Array.isArray(body?.paths) && body.paths.length > 0 ? body.paths : ["/", "/index.html"];

  if (!distributionId) {
    throw new Error("distributionId is required");
  }

  const callerReference = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const command = new CreateInvalidationCommand({
    DistributionId: distributionId,
    InvalidationBatch: {
      CallerReference: callerReference,
      Paths: {
        Quantity: paths.length,
        Items: paths
      }
    }
  });

  const result = await cloudFront.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      invalidationId: result.Invalidation?.Id,
      status: result.Invalidation?.Status
    })
  };
};
