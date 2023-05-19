module.exports = (server/* , options */) => {
  // handle http request
  server.on('request', (req, res) => {

    if (req.originalReq.realUrl.includes("h5/mtop.alibaba.detail.subpage.getdetail/2.0/")) {

      // 简单处理，不支持各种编码，省得对响应内容进行解码
      delete req.headers['accept-encoding'];
      const client = req.request((svrRes) => {
        // 由于内容长度可能有变，删除长度自动改成 chunked
        delete svrRes.headers['content-length'];
        res.writeHead(svrRes.statusCode, svrRes.headers);
        let body;
        svrRes.on('data', (data) => {
          body = body ? Buffer.concat([body, data]) : data;
        });
        svrRes.on('end', () => {
          if (body) {
            body  = body.toString()

            // 正则替换 \"salable\":\"false\"  \"salable\":\"true\"
            body = body.replace(/\\"salable\\":\\"false\\"/g, "\\\"salable\\\":\\\"true\\\"")

            console.log(body)

            res.end(body);


          } else {
            res.end();
          }
        });
      });

      req.pipe(client);
      return;
    }


    // req.pipe(client);
    req.passThrough(); // 直接透传

  });

  // handle websocket request
  server.on('upgrade', (req/*, socket*/) => {
    // 修改 websocket 请求用，
    req.passThrough(); // 直接透传
  });

  // handle tunnel request
  server.on('connect', (req/*, socket*/) => {
    // 修改普通 tcp 请求用
    req.passThrough(); // 直接透传
  });
};
