'use strict';

module.exports = () => {
  return async function checkAccessKey(ctx, next) {
    const api_access_key = ctx.request.header.api_access_key || ctx.query.api_access_key;
    if (api_access_key === 'bilibili_Rong_sister') {
      await next();
    } else {
      ctx.body = { code: 110, message: '缺少api_access_key' };
    }
  };
};
