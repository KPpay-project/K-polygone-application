# KPay User Frontend

A React + TypeScript + Vite application for KPay user interface with internationalization support.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended package manager)
- Git access to private repositories (for submodules)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd k-pay-user
   ```

2. **Install dependencies (this will automatically set everything up):**

   ```bash
   pnpm install
   ```

   This command automatically:
   - Installs all project dependencies
   - Initializes and updates git submodules
   - Sets up and builds the assets package
   - Configures the development environment

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```

### Manual Setup (if automatic setup fails)

If the automatic setup doesn't work, you can run these commands manually:

```bash
# Initialize submodules
git submodule update --init --recursive

# Setup assets package
cd assets
pnpm install
pnpm run build
cd ..

# Install main project dependencies
pnpm install

# Start development server
pnpm run dev
```

## 📦 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint errors
- `pnpm run format` - Format code with Prettier
- `pnpm run type-check` - Run TypeScript type checking
- `pnpm run setup:project` - Manual project setup
- `pnpm run setup:submodule` - Initialize git submodules
- `pnpm run setup:assets` - Setup and build assets package

## 🌍 Internationalization

The project supports multiple languages:

- English (en) - Default
- French (fr)
- Spanish (es)
- German (de)
- Arabic (ar)

Translation files are located in `src/i18n/locales/`.

## 🏗️ Project Structure

```
├── src/
│   ├── components/          # Reusable UI components
│   ├── pages/              # Page components
│   ├── i18n/               # Internationalization files
│   │   └── locales/        # Translation JSON files
│   ├── lib/                # Utility libraries
│   ├── hooks/              # Custom React hooks
│   └── styles/             # Global styles
├── assets/                 # Git submodule for shared assets
├── public/                 # Static assets
└── dist/                   # Build output
```

## 🔧 Development

### Adding New Translations

1. Add your translation keys to `src/i18n/locales/en.json`
2. Add corresponding translations to other language files
3. Use in components with `const { t } = useTranslation()`

### Working with Assets

The `assets/` directory is a git submodule containing shared components and icons. It's automatically set up when you run `pnpm install`.

## 🚨 Troubleshooting

### Submodule Issues

If you encounter submodule-related errors:

```bash
git submodule deinit --force --all
git submodule update --init --recursive
```

### Assets Package Issues

If the assets package fails to build:

```bash
cd assets
pnpm install --force
pnpm run build
```

### Clean Installation

For a completely clean setup:

```bash
rm -rf node_modules assets/.git/modules
pnpm install
```

## 📋 Environment Variables

Create a `.env` file in the root directory:

```env
# Add your environment variables here
VITE_API_URL=your_api_url
```

## 🚀 Deployment

This project uses **AWS SAM (Serverless Application Model)** for infrastructure deployment and CI/CD.

### Automatic Deployment (CI/CD)

The application is automatically deployed when code is pushed to:

- `main` branch → deploys to **production** environment
- `dev` branch → deploys to **development** environment

The CI/CD pipeline:

1. 🏗️ Builds the React application
2. 🚀 Deploys AWS infrastructure (S3 + CloudFront) using SAM
3. ⬆️ Uploads built files to S3
4. 🧹 Invalidates CloudFront cache

### Manual Deployment

You can trigger manual deployments through GitHub Actions:

1. Go to the "Actions" tab in GitHub
2. Select "Deploy with AWS SAM" workflow
3. Click "Run workflow" and choose environment

### Local Deployment

For local deployment using the provided script:

```bash
# Deploy to production
./infrastructure/deploy.sh prod

# Deploy to development
./infrastructure/deploy.sh dev
```

### Infrastructure

The AWS infrastructure includes:

- **S3 Bucket**: Static website hosting
- **CloudFront Distribution**: Global CDN
- **Origin Access Control**: Secure S3 access

For detailed infrastructure documentation, see [`infrastructure/README.md`](infrastructure/README.md).

### Required GitHub Secrets

For CI/CD to work, configure these secrets in your GitHub repository:

- `AWS_ACCESS_KEY_ID`: AWS access key
- `AWS_SECRET_ACCESS_KEY`: AWS secret key
- `SSH_PRIVATE_KEY`: SSH key for git submodules

## 🎯 What Happens When You Run `pnpm install`

The `postinstall` script automatically:

1. ✅ **Checks prerequisites** (Git, Node.js, pnpm)
2. ✅ **Initializes git submodules** (pulls the assets package)
3. ✅ **Sets up the assets package** (installs dependencies & builds)
4. ✅ **Installs main project dependencies**
5. ✅ **Verifies the setup** is complete
6. ✅ **Shows welcome message** with next steps

If any step fails, the script provides helpful error messages and fallback options.

## 🛠️ Manual Setup Commands

If you need to run setup steps individually:

```bash
pnpm run setup           # Full automated setup
pnpm run welcome         # Show welcome message
pnpm run setup:manual    # Manual submodule + assets setup
pnpm run setup:submodule # Just initialize submodules
pnpm run setup:assets    # Just setup assets package
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname
    }
  }
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules
  }
});
```
