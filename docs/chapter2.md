### 网络优化方法
- 合并资源文件，减少HTTP请求
- 压缩资源文件，减小请求大小
- 利用缓存机制，尽可能使用缓存减少请求

### 服务端渲染
- 单页应用问题
  - SEO不友好
  - 首次请求等待时间较长，体验不好

### 配置webpack-dev-server注意点
```
// 此处要确保文件夹中不存在dist目录
// 否则webpack-dev-server会默认先检查dist目录中的内容
config.devServer = {
  host: '0.0.0.0',
  port: '8888',
  contentBase: path.join(__dirname, '../dist'),
  publicPath: '/public',
  historyApiFallback: {
    index: '/public/index.html',
  },
  // hot: true,
  overlay: {
    errors: true,
  },
};
```
  
### 配置hot module replacement注意点
1. 在.babelrc文件中plugins属性添加react-hot-loader/babel
2. 添加相关代码决定热替换时执行的操作
```
// ["es2015", { "modules": false }]的设置可以通过 
// const NextApp = require('./app').default; 达到同样的效果
if (module.hot) {
  module.hot.accepet('./app.js', () => {
    const NextApp = require('./app').default;
    ReactDOM.render(
      <NextApp />,
      document.getElementById('app')
    );
  })
}
```

### 服务端渲染
1. 
2. 
