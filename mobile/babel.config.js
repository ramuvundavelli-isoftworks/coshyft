module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
            '@api': './src/api',
            '@screens': './src/screens',
            '@components': './src/components',
            '@navigation': './src/navigation',
            '@context': './src/context',
            '@types': './src/types',
            '@utils': './src/utils',
            '@hooks': './src/hooks',
            '@constants': './src/constants',
          },
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};