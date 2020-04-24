'use strict';

const Controller = require('egg').Controller;

class ScheduleController extends Controller {
  async startSchedule() {
    const { ctx } = this;
    const { method } = ctx.params;
    switch (method) {
      case 'following':
        // 启动
        break;
      case 'follower':
        //
        break;
      case 'account':
        // 开启用户信息爬取
        break;
      default:
        break;
    }
  }
}

module.exports = ScheduleController;
