

set -e 

echo "🚀 Setting up KPay User Frontend..."
echo "=================================="


RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' 


print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}


if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
    if [ $? -eq 0 ]; then
        print_success "pnpm installed successfully"
    else
        print_error "Failed to install pnpm. Please install it manually: npm install -g pnpm"
        exit 1
    fi
fi

print_status "Initializing git submodules..."
if git submodule update --init --recursive; then
    print_success "Git submodules initialized successfully"
else
    print_warning "Could not initialize submodules. This might be due to:"
    print_warning "1. Missing SSH keys for private repositories"
    print_warning "2. Network connectivity issues"
    print_warning "3. Repository access permissions"
    print_warning "Please check your git configuration and try again manually"
fi

print_status "Checking assets directory..."
if [ -d "assets" ]; then
    print_success "Assets directory found"

    print_status "Installing assets dependencies..."
    cd assets
    
    if pnpm install; then
        print_success "Assets dependencies installed"
        
   
        print_status "Building assets package..."
        if pnpm run build; then
            print_success "Assets built successfully"
        else
            print_error "Failed to build assets package"
        fi
    else
        print_error "Failed to install assets dependencies"
    fi
    
    cd ..
else
    print_warning "Assets directory not found. Creating dummy assets..."
    mkdir -p assets/src/components assets/src/icons assets/src/utils
    echo '{"name": "k-polygon-assets", "version": "1.0.0", "main": "src/index.ts"}' > assets/package.json
    echo 'export * from "./components"; export * from "./icons"; export * from "./utils";' > assets/src/index.ts
    echo 'export const cn = () => "";' > assets/src/utils/index.ts
    echo 'export const Button = () => null;' > assets/src/components/index.ts
    echo 'export const IconArrowRight = () => null;' > assets/src/icons/index.ts
    print_warning "Dummy assets created. Please set up the real assets submodule manually"
fi


print_status "Installing main project dependencies..."
if pnpm install --frozen-lockfile; then
    print_success "Main dependencies installed successfully"
else
    print_warning "Frozen lockfile install failed, trying regular install..."
    if pnpm install; then
        print_success "Dependencies installed successfully"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
fi


print_status "Running type check..."
if pnpm run type-check; then
    print_success "Type check passed"
else
    print_warning "Type check failed. This might be normal during initial setup"
fi


print_status "Verifying setup..."


if [ -f "package.json" ] && [ -f "vite.config.ts" ] && [ -d "src" ]; then
    print_success "Project structure looks good"
else
    print_error "Project structure is incomplete"
fi

echo ""
echo "=================================="
print_success "Setup completed!"
echo ""
echo "🎉 You can now start developing:"
echo "   pnpm run dev      
echo "   pnpm run build    
echo "   pnpm run lint     
echo ""
echo "📚 Useful commands:"
echo "   pnpm run format   
echo "   pnpm run preview  
echo ""
echo "🌐 The app will be available at: http://localhost:5173"
echo "=================================="
