#!/bin/bash

# KPay User App - SAM Deployment Script
# Usage: ./deploy.sh [environment]
# Environment: prod (default) or dev

# Removed set -e to handle SAM deploy errors manually

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default environment
ENVIRONMENT=${1:-prod}

# Validate environment
if [[ "$ENVIRONMENT" != "prod" && "$ENVIRONMENT" != "dev" ]]; then
    echo -e "${RED}Error: Environment must be 'prod' or 'dev'${NC}"
    echo "Usage: $0 [prod|dev]"
    exit 1
fi

echo -e "${BLUE}🚀 Deploying KPay User App to ${ENVIRONMENT} environment${NC}"

# Check if we're in the right directory
if [[ ! -f "template.yml" ]]; then
    echo -e "${RED}Error: template.yml not found. Please run this script from the infrastructure directory.${NC}"
    exit 1
fi

# Check if SAM CLI is installed
if ! command -v sam &> /dev/null; then
    echo -e "${RED}Error: AWS SAM CLI is not installed.${NC}"
    echo "Please install it from: https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html"
    exit 1
fi

# Check if AWS CLI is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}Error: AWS CLI is not configured or credentials are invalid.${NC}"
    echo "Please run: aws configure"
    exit 1
fi

# Set region
REGION="eu-north-1"

echo -e "${YELLOW}📋 Deployment Configuration:${NC}"
echo "  Environment: $ENVIRONMENT"
echo "  Region: $REGION"
echo "  Stack Name: kpay-user-webapp-$ENVIRONMENT"
echo ""

# Build the application first
echo -e "${BLUE}🛠️  Building application...${NC}"
cd ..
if command -v pnpm &> /dev/null; then
    pnpm install --force
    pnpm run build
elif command -v npm &> /dev/null; then
    npm ci
    npm run build
else
    echo -e "${RED}Error: Neither pnpm nor npm found.${NC}"
    exit 1
fi

# Return to infrastructure directory
cd infrastructure

# Deploy with SAM
echo -e "${BLUE}🚀 Deploying infrastructure with SAM...${NC}"
if [[ "$ENVIRONMENT" == "prod" ]]; then
    CONFIG_ENV="default"
else
    CONFIG_ENV="dev"
fi

# Capture SAM deploy output and exit code
SAM_OUTPUT=$(sam deploy --config-env "$CONFIG_ENV" 2>&1)
SAM_EXIT_CODE=$?

echo "$SAM_OUTPUT"

# Check if deployment succeeded or if there are no changes to deploy
if [[ $SAM_EXIT_CODE -eq 0 ]] || [[ "$SAM_OUTPUT" == *"No changes to deploy"* ]]; then
    if [[ $SAM_EXIT_CODE -eq 0 ]]; then
        echo -e "${GREEN}✅ Infrastructure deployed successfully!${NC}"
    else
        echo -e "${YELLOW}ℹ️  No infrastructure changes detected, proceeding with file upload...${NC}"
    fi
    
    # Get stack outputs
    echo -e "${BLUE}📤 Getting stack outputs...${NC}"
    STACK_NAME="kpay-user-webapp-$ENVIRONMENT"
    
    BUCKET_NAME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebAppS3BucketName`].OutputValue' \
        --output text)

    DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text)

    DOMAIN_NAME=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebAppDomain`].OutputValue' \
        --output text)
    
    echo -e "${YELLOW}📋 Stack Outputs:${NC}"
    echo "  S3 Bucket: $BUCKET_NAME"
    echo "  CloudFront Distribution: $DISTRIBUTION_ID"
    echo "  Domain: $DOMAIN_NAME"
    echo ""
    
    # Upload files to S3
    echo -e "${BLUE}⬆️  Uploading files to S3...${NC}"
    aws s3 sync ../dist/ "s3://$BUCKET_NAME" --delete --region "$REGION"
    
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ Files uploaded successfully!${NC}"
        
        # Invalidate CloudFront cache
        echo -e "${BLUE}🧹 Invalidating CloudFront cache...${NC}"
        aws cloudfront create-invalidation \
            --distribution-id "$DISTRIBUTION_ID" \
            --paths "/*" \
            --region "$REGION" > /dev/null
        
        echo -e "${GREEN}✅ Deployment complete!${NC}"
        echo -e "${GREEN}🔗 Application URL: https://$DOMAIN_NAME${NC}"
    else
        echo -e "${RED}❌ Failed to upload files to S3${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Infrastructure deployment failed${NC}"
    exit 1
fi