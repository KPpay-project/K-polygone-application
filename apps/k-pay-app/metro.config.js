const path = require('path');
const { withNativeWind } = require('nativewind/metro');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

// Get the default Expo/Sentry config first
const config = getSentryExpoConfig(projectRoot);

config.resolver = {
  ...config.resolver,
  unstable_enablePackageExports: false,
  platforms: ['ios', 'android', 'native', 'web'],
  disableHierarchicalLookup: true,
  nodeModulesPaths: [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(workspaceRoot, 'node_modules'),
  ],
  extraNodeModules: {
    ...(config.resolver?.extraNodeModules || {}),
    react: path.resolve(projectRoot, 'node_modules/react'),
    'react/jsx-runtime': path.resolve(projectRoot, 'node_modules/react/jsx-runtime.js'),
    'react/jsx-dev-runtime': path.resolve(projectRoot, 'node_modules/react/jsx-dev-runtime.js'),
    'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
    url: path.resolve(projectRoot, 'node_modules/url'),
  },
};

config.watchFolders = [workspaceRoot, ...(config.watchFolders || [])];

module.exports = withNativeWind(config, { input: './global.css' });
