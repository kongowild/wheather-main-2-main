module.exports = {
  presets: [
    'react-app',
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
  ],
};
