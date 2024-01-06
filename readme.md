# Aggregator

This repo is the code behind [https://reader.beckelman.net](https://reader.beckelman.net).

This site is a static website built from a list of RSS URLs found in [urls.txt](./urls.txt).

The HTML is deployed to an S3 bucket which is then fronted by AWS CloudFront.

A [github action on a CRON schedule](./.github/workflows/build.yml) will then update the site per the CRON schedule.

### Adding new RSS feeds

A new RSS feed can be added by including it in [urls.txt](./urls.txt). Once added push the change to github. A github action will then take care of building and deploying the static website.

### Stack

- nodejs
- AWS CDK
  - S3
  - CloudFront
  - Route53

### Infrastructure deployment

The infrastructure for this site only needs to be deployed once. After that, all content deployments are handled by the [github action](./.github/workflows/build.yml).

The infrastructure (S3 Bucket / CloudFront/ DNS) is deployed via an [AWS CDK Stack](./aws/reader-stack.js). The following environment variable should be set via an `.env` file prior to doing so:

```
AWS_ACCOUNT_ID=
AWS_REGION=us-east-1
DOMAIN_NAME=
SUBDOMAIN_NAME=
BUCKET_NAME=
CERTIFICATE_ARN=
```

### Building the HTML for the site

If you are interesting in how the HTML is generated for the site check out [index.js](./src/index.js)
