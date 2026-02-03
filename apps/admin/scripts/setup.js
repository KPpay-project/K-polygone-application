#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = colors.blue) {
  console.log(`${color}[INFO]${colors.reset} ${message}`);
}

function success(message) {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`);
}

function warning(message) {
  console.log(`${colors.yellow}[WARNING]${colors.reset} ${message}`);
}

function error(message) {
  console.log(`${colors.red}[ERROR]${colors.reset} ${message}`);
}

function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      cwd: options.cwd || process.cwd(),
      encoding: 'utf8'
    });
    return { success: true, output: result };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

function checkCommand(command) {
  const result = runCommand(`${command} --version`, { silent: true });
  return result.success;
}

async function setup() {
  console.log('🚀 Setting up KPay User Frontend...');
  console.log('==================================');

  log('Checking prerequisites...');

  if (!checkCommand('git')) {
    error('Git is not installed. Please install Git first.');
    process.exit(1);
  }

  if (!checkCommand('node')) {
    error('Node.js is not installed. Please install Node.js 18+ first.');
    process.exit(1);
  }

  if (!checkCommand('pnpm')) {
    warning('pnpm is not installed. Installing pnpm...');
    const installPnpm = runCommand('npm install -g pnpm');
    if (installPnpm.success) {
      success('pnpm installed successfully');
    } else {
      error('Failed to install pnpm. Please install it manually: npm install -g pnpm');
      process.exit(1);
    }
  }

  log('Initializing git submodules...');
  const submoduleResult = runCommand('git submodule update --init --recursive');

  if (submoduleResult.success) {
    success('Git submodules initialized successfully');
  } else {
    warning('Could not initialize submodules. This might be due to:');
    warning('1. Missing SSH keys for private repositories');
    warning('2. Network connectivity issues');
    warning('3. Repository access permissions');
    warning('Creating dummy assets as fallback...');

    const assetsDir = path.join(process.cwd(), 'assets');
    const srcDir = path.join(assetsDir, 'src');
    const componentsDir = path.join(srcDir, 'components');
    const iconsDir = path.join(srcDir, 'icons');
    const utilsDir = path.join(srcDir, 'utils');

    [assetsDir, srcDir, componentsDir, iconsDir, utilsDir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    const packageJson = {
      name: 'k-polygon-assets',
      version: '1.0.0',
      main: 'src/index.ts',
      scripts: {
        build: 'echo "Dummy build completed"'
      }
    };

    fs.writeFileSync(path.join(assetsDir, 'package.json'), JSON.stringify(packageJson, null, 2));
    fs.writeFileSync(
      path.join(srcDir, 'index.ts'),
      'export * from "./components"; export * from "./icons"; export * from "./utils";'
    );
    fs.writeFileSync(path.join(utilsDir, 'index.ts'), 'export const cn = () => "";');
    fs.writeFileSync(path.join(componentsDir, 'index.ts'), 'export const Button = () => null;');
    fs.writeFileSync(path.join(iconsDir, 'index.ts'), 'export const IconArrowRight = () => null;');
  }

  const assetsPath = path.join(process.cwd(), 'assets');
  if (fs.existsSync(assetsPath)) {
    log('Setting up assets package...');

    const assetsInstall = runCommand('pnpm install', { cwd: assetsPath });
    if (assetsInstall.success) {
      success('Assets dependencies installed');

      log('Building assets package...');
      const assetsBuild = runCommand('pnpm run build', { cwd: assetsPath });
      if (assetsBuild.success) {
        success('Assets built successfully');
      } else {
        warning('Failed to build assets package');
      }
    } else {
      warning('Failed to install assets dependencies');
    }
  }

  if (!process.env.npm_lifecycle_event || process.env.npm_lifecycle_event !== 'postinstall') {
    log('Installing main project dependencies...');
    let installResult = runCommand('pnpm install --frozen-lockfile');

    if (!installResult.success) {
      warning('Frozen lockfile install failed, trying regular install...');
      installResult = runCommand('pnpm install');
    }

    if (installResult.success) {
      success('Main dependencies installed successfully');
    } else {
      error('Failed to install dependencies');
      process.exit(1);
    }
  } else {
    log('Skipping dependency installation (already in postinstall)');
    success('Dependencies are being installed by npm/pnpm');
  }

  log('Verifying setup...');
  const requiredFiles = ['package.json', 'vite.config.ts'];
  const requiredDirs = ['src'];

  let setupValid = true;

  requiredFiles.forEach((file) => {
    if (!fs.existsSync(path.join(process.cwd(), file))) {
      error(`Missing required file: ${file}`);
      setupValid = false;
    }
  });

  requiredDirs.forEach((dir) => {
    if (!fs.existsSync(path.join(process.cwd(), dir))) {
      error(`Missing required directory: ${dir}`);
      setupValid = false;
    }
  });

  if (setupValid) {
    success('Project structure looks good');
  }

  console.log('\n==================================');
  success('Setup completed!');
  console.log('\n🎉 You can now start developing:');
  console.log('   pnpm run dev      # Start development server');
  console.log('   pnpm run build    # Build for production');
  console.log('   pnpm run lint     # Check code quality');
  console.log('\n📚 Useful commands:');
  console.log('   pnpm run format   # Format code');
  console.log('   pnpm run preview  # Preview production build');
  console.log('==================================');
}

setup().catch((err) => {
  error(`Setup failed: ${err.message}`);
  process.exit(1);
});
