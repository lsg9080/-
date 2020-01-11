/**
 * 实现vue打包后生成配置文件用以外部修改公共路径
 */
/*const GeneraterAssetPlugin = require('generate-asset-webpack-plugin')
const serverConfig = require('../serverConfig.json')
const createJson = function (compilation) {
  return JSON.stringify(serverConfig);
};
new GeneraterAssetPlugin({
  filename: 'serverConfig.json',//输出到dist根目录下的serverConfig.json文件,名字可以按需改
  fn: (compilation, cb) => {
    cb(null, createJson(compilation));
  }
})*/



module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'https://staffapis.wincome.group/staffOrderingH5.API/',
        ws: true,//是否代理websockets
        changeOrigin: true,   // 设置同源  默认false，是否需要改变原始主机头为目标URL
        pathRewrite: {
          '^/api':  '/'//这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
        }
      }
    }
  },
 
  css: {
    loaderOptions: {
      stylus: {
        'resolve url': true,
        'import': [
          './src/theme'
        ]
      }
    }
  },
  pluginOptions: {
    'cube-ui': {
      postCompile: true,
      theme: true
    }
  },
  assetsDir: "static"
}
