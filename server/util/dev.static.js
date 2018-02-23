const path = require('path');
const axios = require('axios');
const webpack = require('webpack');
const MemoryFs = require('memory-fs');
const ReactDOMServer = require('react-dom/server');
const httpProxyMiddleware = require('http-proxy-middleware');

const serverConfig = require('../../build/webpack.config.server');

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/index.html')
      .then((res) => {
        resolve(res.data);
      })
      .catch(reject);
  });
};
// 编译服务端渲染时导出的内容serverBundle
const Module = module.constructor;
const mfs = new MemoryFs();
const serverCompiler = webpack(serverConfig);
// 默认的文件系统为fs，修改为mfs可以加快文件存取速度
serverCompiler.outputFileSystem = mfs;
let serverBundle;
serverCompiler.watch({}, (err, stats) => {
  if (err) {
    throw err;
  }
  stats = stats.toJson();
  stats.errors.forEach(console.error);
  stats.warnings.forEach(console.warn);
  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename,
  );
  // 注意点
  // 1. 读取文件是添加编码，否则为buffer
  // 2. _compile函数需传入第二参数作为文件名称
  // 3. 最终导出的内容为m.exports.default上的内容
  const bundle = mfs.readFileSync(bundlePath, 'utf-8');
  const m = new Module();
  m._compile(bundle, 'server.entry.js');
  serverBundle = m.exports.default;
});

module.exports = (app) => {
  app.use('/public', httpProxyMiddleware({
    target: 'http://localhost:8888',
  }));
  app.get('*', (req, res) => {
    getTemplate().then((template) => {
      const content = ReactDOMServer.renderToString(serverBundle);
      res.send(template.replace('<!-- app -->', content));
    });
  });
};
