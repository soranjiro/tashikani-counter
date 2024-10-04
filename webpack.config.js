const path = require("path");

module.exports = {
  resolve: {
    fallback: {
      buffer: require.resolve("buffer/"),
      url: require.resolve("url/"),
      https: require.resolve("https-browserify"),
      querystring: require.resolve("querystring-es3"),
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      net: false,
      tls: false,
      assert: require.resolve("assert/"),
      os: require.resolve("os-browserify/browser"),
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      fs: false,
      child_process: false,
      util: require.resolve("util/"),
    },
  },
  // 他の設定がある場合はここに追加
};
