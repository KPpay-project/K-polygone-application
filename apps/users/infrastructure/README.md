# KPay User App Infrastructure

This directory contains the AWS SAM template and configuration for deploying the KPay User frontend application to AWS.

## Architecture

The infrastructure includes:

- **S3 Bucket**: Hosts the static website files
- **CloudFront Distribution**: CDN for global content delivery
- **Origin Access Control (OAC)**: Secure access from CloudFront to S3
- **S3 Bucket Policy**: Allows CloudFront to access S3 objects

## Environments

The template supports multiple environments:

- **prod**: Production environment (deployed from `main` branch)
- **dev**: Development environment (deployed from `dev` branch)

## Deployment

### Automatic Deployment (CI/CD)

The application is automatically deployed using GitHub Actions when code is pushed to:

- `main` branch → deploys to **prod** environment
- `dev` branch → deploys to **dev** environment

### Manual Deployment

You can also trigger manual deployments through GitHub Actions:

1. Go to the "Actions" tab in your GitHub repository
2. Select "Deploy with AWS SAM" workflow
3. Click "Run workflow"
4. Choose the environment (prod/dev)

### Local Deployment

To deploy manually from your local machine:

1. **Install AWS SAM CLI**:

   ```bash
   # macOS
   brew install aws-sam-cli

   # Or download from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html
   ```

2. **Configure AWS credentials**:

   ```bash
   aws configure
   ```

3. **Deploy to production**:

   ```bash
   cd infrastructure
   sam deploy --config-env default
   ```

4. **Deploy to development**:
   ```bash
   cd infrastructure
   sam deploy --config-env dev
   ```

## Required GitHub Secrets

For the CI/CD pipeline to work, configure these secrets in your GitHub repository:

| Secret Name             | Description                                  |
| ----------------------- | -------------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS access key for deployment                |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for deployment                |
| `SSH_PRIVATE_KEY`       | SSH private key for accessing git submodules |

### Setting up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with the appropriate value

### AWS IAM Permissions

The AWS user/role used for deployment needs the following permissions:

- CloudFormation (full access)
- S3 (full access)
- CloudFront (full access)
- IAM (limited access for creating roles and policies)

## Configuration Files

- `template.yml`: AWS SAM template defining the infrastructure
- `samconfig.toml`: SAM configuration for different environments

## Stack Outputs

After deployment, the stack provides these outputs:

- **WebAppDomain**: CloudFront distribution domain name
- **CloudFrontDistributionId**: Distribution ID for cache invalidation
- **WebAppS3BucketName**: S3 bucket name for file uploads

## Troubleshooting

### Common Issues

1. **Permission Denied**: Ensure AWS credentials have sufficient permissions
2. **Stack Already Exists**: Use `sam deploy --config-env <env>` to update existing stack
3. **Submodule Access**: Ensure SSH_PRIVATE_KEY secret is correctly configured

### Viewing Logs

- Check GitHub Actions logs for deployment status
- View CloudFormation events in AWS Console
- Monitor CloudFront and S3 metrics in AWS Console

## Clean Up

To delete the infrastructure:

```bash
# Delete production stack
aws cloudformation delete-stack --stack-name kpay-user-webapp-prod

# Delete development stack
aws cloudformation delete-stack --stack-name kpay-user-webapp-dev
```

**Note**: This will permanently delete all resources including the S3 bucket and its contents.
