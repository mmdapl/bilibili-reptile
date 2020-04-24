'use strict';
/**
 * 全局统一错误处理；
 * code值说明
 * 0:操作成功
 * 1：操作失败
 * 110：没有权限，未登录
 * 93:参数错误
 * 3306:数据库操作错误
 * 500：服务器内部错误
 * 8848:登录服出现错误
 * 8813:B站请求链接出错
 * 保证所有的接口status状态返回为200
 */
// const responseMsg = {
//   0: { code: 0, message: '操作成功' },
//   1: { code: 1, message: '操作失败' },
//   93: { code: 93, message: '请求参数错误，无法实现当前操作' },
//   110: { code: 110, message: '当前登录会话有效，用户没有无该操作权限' },
//   404: { code: 404, message: '当前请求不存在，' },
//   3306: { code: 3306, message: '服务器内部错误，数据库操作失败，联系站长处理' },
//   8813: { code: 8813, message: '外链失效，B站接口链接无法响应，联系站长处理' },
//   8848: { code: 8848, message: '登录服接口异常，联系站长处理' },
// };

module.exports = () => {
  return async function errorHandler(ctx, next) {
    // get from config
    const responseMsg = ctx.app.config.responseMsg;
    try {
      ctx.logger.info({ Query: ctx.query, Body: ctx.request.body, Params: ctx.params });
      await next();
      if (!ctx.body || !responseMsg.hasOwnProperty(ctx.body.code)) {
        ctx.body = responseMsg[404];
        // 直接渲染出404统一页面
        return;
      }
      // 处理返回值的data
      const finalRes = responseMsg[ctx.body.code];
      if (ctx.body.data || Object.getOwnPropertyNames(ctx.body).includes('data')) {
        finalRes.data = ctx.body.data;
      }
      // 处理message
      if (ctx.body.message) {
        finalRes.message = ctx.body.message;
      }
      if (ctx.body.data) {
        finalRes.data = ctx.body.data;
      } else {
        finalRes.data = ctx.app.returnFormat().data;
      }
      ctx.logger.info('[error_handler] interface final response result :', finalRes);
      ctx.body = finalRes;
    } catch (err) {
      ctx.logger.error(err);
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志
      const status = err.status || 500;
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const error = status === 500 && ctx.app.config.env === 'prod'
        ? 'Internal Server Error'
        : err.message;
      ctx.logger.warn(error);
      // 从 error 对象上读出各个属性，设置到响应中
      if (status === 500) {
        ctx.body = ctx.app.returnFormat(500, '当前站点出现未知错误，请联系管理员或者开发人员处理');
      } else if (status === 422) {
        ctx.body = ctx.app.returnFormat(93, '参数错误');
      } else {
        ctx.status = 200;
      }
      // 出现异常
    }
  };
};

