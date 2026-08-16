# AWS Deployment Guide for Vue (IAM + Lambda + S3 + CloudFront)

This guide is tailored for your Vite + Vue app in this repo.

## 1) Is your workflow good?

Your flow is good and very close to production-ready:

1. Edit content/code
2. Commit + push to GitHub
3. GitHub Actions builds app
4. Upload build to S3
5. CloudFront cache invalidates
6. Site updates

### Recommended changes

- Use IAM Role with GitHub OIDC (best practice) instead of long-lived AWS access keys.
- Keep S3 bucket private and serve via CloudFront Origin Access Control (OAC).
- Invalidate only changed paths (or at least `/index.html`) instead of always invalidating `/*`.
- For Vue Router history mode, configure CloudFront SPA fallback to `index.html`.

## 2) Target architecture

```text
GitHub push
  -> GitHub Actions
     -> Assume AWS IAM Role (OIDC)
     -> npm ci && npm run build
     -> Upload dist/ to S3
     -> Invoke Lambda (cache invalidation)
        -> Lambda calls CloudFront CreateInvalidation

Users -> CloudFront -> S3 (private via OAC)
```

## 3) AWS resources you should create

Create these in this order:

1. S3 bucket for site assets
2. CloudFront distribution with OAC
3. IAM OIDC provider + deploy role for GitHub Actions
4. Lambda function for invalidation
5. IAM execution role for Lambda

---

## 4) S3 bucket structure

Bucket name example: `my-vue-site-prod`

```text
s3://my-vue-site-prod/
  index.html
  assets/
    app.[hash].js
    app.[hash].css
  favicon.ico
  robots.txt
  deployments/
    latest.json    (optional deployment metadata)
```

Notes:
- Vite outputs hashed assets in `dist/assets/*`; keep that default.
- Set long cache for hashed assets, short/no-cache for `index.html`.

---

## 5) Local repo structure recommendation

Add these files/folders:

```text
.github/
  workflows/
    deploy-prod.yml
lambda/
  cf-invalidator/
    index.mjs
    package.json
infra/
  iam/
    github-oidc-trust-policy.json
    github-deploy-policy.json
    lambda-execution-policy.json
```

You can keep app source exactly as it is.

---

## 6) IAM setup (GitHub Actions -> AWS)

### A) Create OIDC identity provider

Provider URL:
- `https://token.actions.githubusercontent.com`

Audience:
- `sts.amazonaws.com`

### B) Trust policy for GitHub role

`infra/iam/github-oidc-trust-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:<GITHUB_OWNER>/<GITHUB_REPO>:ref:refs/heads/main"
        }
      }
    }
  ]
}
```

### C) Permissions policy for GitHub deploy role

`infra/iam/github-deploy-policy.json`

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3Deploy",
      "Effect": "Allow",
      "Action": [
        "s3:ListBucket"
      ],
      "Resource": "arn:aws:s3:::my-vue-site-prod"
    },
    {
      "Sid": "S3ObjectDeploy",
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:PutObjectTagging"
      ],
      "Resource": "arn:aws:s3:::my-vue-site-prod/*"
    },
    {
      "Sid": "InvokeInvalidationLambda",
      "Effect": "Allow",
      "Action": [
        "lambda:InvokeFunction"
      ],
      "Resource": "arn:aws:lambda:<REGION>:<ACCOUNT_ID>:function:cf-invalidator-prod"
    }
  ]
}
```

Use least privilege. Restrict to one bucket and one Lambda ARN.

---

## 7) Lambda function (CloudFront invalidation)

Purpose:
- Trigger invalidation after each deployment.
- Keep AWS permissions separated: GitHub role cannot call CloudFront directly.

`lambda/cf-invalidator/index.mjs`

```js
import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

const cf = new CloudFrontClient({});

export const handler = async (event) => {
  const body = typeof event === "string" ? JSON.parse(event) : event;
  const distributionId = body.distributionId;
  const paths = body.paths || ["/index.html", "/"];

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

  const result = await cf.send(command);

  return {
    statusCode: 200,
    body: JSON.stringify({
      invalidationId: result.Invalidation?.Id,
      status: result.Invalidation?.Status
    })
  };
};
```

Lambda execution policy (`infra/iam/lambda-execution-policy.json`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation"
      ],
      "Resource": "*"
    }
  ]
}
```

Note: CloudFront invalidation permission generally uses `Resource: *`.

---

## 8) S3 bucket policy (private bucket + CloudFront OAC)

Do not enable static website hosting for private OAC setup.

Attach a bucket policy like this (replace values):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::my-vue-site-prod/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::<ACCOUNT_ID>:distribution/<DISTRIBUTION_ID>"
        }
      }
    }
  ]
}
```

---

## 9) CloudFront settings for Vue SPA

Important for Vue Router history mode:

- Default root object: `index.html`
- Custom error response:
  - 403 -> `/index.html` (200)
  - 404 -> `/index.html` (200)

Caching strategy:
- `index.html`: low TTL / no-cache
- `assets/*` hashed files: high TTL (immutable)

---

## 10) GitHub Actions workflow

Create `.github/workflows/deploy-prod.yml`:

```yaml
name: Deploy Vue to S3 + CloudFront

on:
  push:
    branches: [main]

permissions:
  id-token: write
  contents: read

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install deps
        run: npm ci

      - name: Build
        run: npm run build

      - name: Configure AWS credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}

      - name: Upload static assets with long cache
        run: |
          aws s3 sync dist/assets s3://${{ vars.S3_BUCKET }}/assets \
            --delete \
            --cache-control "public,max-age=31536000,immutable"

      - name: Upload root files with short cache
        run: |
          aws s3 sync dist s3://${{ vars.S3_BUCKET }} \
            --delete \
            --exclude "assets/*" \
            --cache-control "no-cache,no-store,must-revalidate"

      - name: Invoke invalidation Lambda
        run: |
          payload=$(jq -nc \
            --arg did "${{ vars.CLOUDFRONT_DISTRIBUTION_ID }}" \
            '{distributionId:$did, paths:["/index.html","/"]}')

          aws lambda invoke \
            --function-name "${{ vars.CF_INVALIDATOR_LAMBDA }}" \
            --payload "$payload" \
            --cli-binary-format raw-in-base64-out \
            response.json

          cat response.json
```

Set these in GitHub:

- Repository Secret: `AWS_DEPLOY_ROLE_ARN`
- Repository Variable: `AWS_REGION`
- Repository Variable: `S3_BUCKET`
- Repository Variable: `CLOUDFRONT_DISTRIBUTION_ID`
- Repository Variable: `CF_INVALIDATOR_LAMBDA`

---

## 11) Vite config check

Your current `vite.config.js` is fine if deployed at domain root.

If deploying to a subpath like `https://example.com/app/`, add:

```js
export default defineConfig({
  base: "/app/",
  plugins: [vue()]
})
```

---

## 12) What you should do now (practical checklist)

1. Create S3 bucket (`my-vue-site-prod`) with Block Public Access ON.
2. Create CloudFront distribution with S3 origin + OAC.
3. Set SPA fallback errors (403/404 -> `/index.html`, response 200).
4. Create Lambda function `cf-invalidator-prod` and attach execution role.
5. Create IAM OIDC provider and deploy role for GitHub.
6. Attach trust policy + deploy policy to role.
7. Add GitHub Actions workflow in `.github/workflows/deploy-prod.yml`.
8. Add GitHub repo secret/variables.
9. Push to `main` and verify Actions logs.
10. Open CloudFront URL and test deep route (for example `/about`).

---

## 13) Common mistakes to avoid

- Using access keys in GitHub secrets instead of OIDC role.
- Public S3 bucket with no OAC.
- Forgetting SPA fallback in CloudFront.
- Invalidating `/*` every deploy (slow + unnecessary).
- Serving `index.html` with long cache headers.

---

## 14) Optional simplification

If you do not need Lambda, GitHub Actions can call `aws cloudfront create-invalidation` directly.

But since you want Lambda in the architecture, keeping invalidation in Lambda is a clean separation of responsibilities.
