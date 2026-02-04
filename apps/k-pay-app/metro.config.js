const { withNativeWind } = require('nativewind/metro');
const { getSentryExpoConfig } = require('@sentry/react-native/metro');

// Get the default Expo/Sentry config first
const config = getSentryExpoConfig(__dirname);

config.resolver = {
  ...config.resolver,
  // Disable package exports to avoid the countLines error
  unstable_enablePackageExports: false,
  platforms: ['ios', 'android', 'native', 'web'],
};

module.exports = withNativeWind(config, { input: './global.css' });
