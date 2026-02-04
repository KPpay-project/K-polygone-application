#!/bin/bash

# Test CI workflow locally
echo "🧪 Testing CI workflow locally..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Step 1: Testing submodule initialization...${NC}"
# Clean submodules
git submodule deinit --force --all || true
rm -rf .git/modules/assets || true
rm -rf assets || true

# Re-initialize
if git submodule sync --recursive && git submodule update --init --recursive --force; then
    echo -e "${GREEN}✅ Submodules initialized successfully${NC}"
else
    echo -e "${RED}❌ Submodule initialization failed${NC}"
    exit 1
fi

# Verify assets directory exists
if [ ! -d "assets" ]; then
    echo -e "${RED}❌ Assets directory not found${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Step 2: Testing dependency installation...${NC}"
# Test setup script
if pnpm run setup; then
    echo -e "${GREEN}✅ Setup completed successfully${NC}"
else
    echo -e "${RED}❌ Setup failed${NC}"
    exit 1
fi

echo -e "${YELLOW}🛠️ Step 3: Testing build process...${NC}"
# Test build
if pnpm run build; then
    echo -e "${GREEN}✅ Build completed successfully${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

# Verify dist directory exists
if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Dist directory not found${NC}"
    exit 1
fi

echo -e "${YELLOW}🏗️ Step 4: Testing SAM template validation...${NC}"
# Test SAM template
cd infrastructure
if sam validate; then
    echo -e "${GREEN}✅ SAM template is valid${NC}"
else
    echo -e "${RED}❌ SAM template validation failed${NC}"
    exit 1
fi
cd ..

echo -e "${GREEN}🎉 All CI workflow steps completed successfully!${NC}"
echo -e "${GREEN}✅ The CI should now work properly in GitHub Actions${NC}"

echo ""
echo "📋 Summary:"
echo "  ✅ Submodule initialization: Working"
echo "  ✅ Dependency installation: Working"
echo "  ✅ Build process: Working"
echo "  ✅ SAM template: Valid"
echo ""
echo "🚀 Ready for deployment!"