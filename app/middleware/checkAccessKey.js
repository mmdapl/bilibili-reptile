'use strict';

module.exports = () => {
  return async function checkAccessKey(ctx, next) {
    const api_access_key = ctx.request.header.api_access_key || ctx.query.api_access_key;
    if (api_access_key === '19970118_520_19980115') {
      await next();
    } else {
      ctx.body = { code: 110, message: '缺少api_access_key' };
    }
  };
};
