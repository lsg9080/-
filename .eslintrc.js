module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  rules: {
    'no-console':  'off',//process.env.NODE_ENV === 'production' ? 'error' :
    'no-debugger':  'off'//process.env.NODE_ENV === 'production' ? 'error' :
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
