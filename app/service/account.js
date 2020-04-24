'use strict';

const Service = require('egg').Service;

class AccountService extends Service {

  /**
   *
   * up个人信息添加
   * @param {Object} info
   */
  async create(info) {
    const { ctx } = this;
    // 添加create_time字段
    info.create_time = new Date().getTime();
    return await ctx.model.Account.create(info).then(ret => {
      return ret ? { code: 0 } : { code: 1 };
    });
  }
  /**
   * 获取表中mid的集合
   */
  async getMidArray() {
    const { ctx } = this;
    return await ctx.model.Account.findAll({
      raw: true,
      attributes: [ 'mid' ],
    }).then(ret => {
      return { code: 0, data: ret };
    });
  }

  async isExistUpInfo(mid) {
    const { ctx } = this;
    return await ctx.model.Account.findAll({
      raw: true,
      where: {
        mid,
      },
    }).then(ret => {
      return !!(ret && ret.length > 0);
    });
  }
  async update(info) {
    const { ctx } = this;
    info.modify_time = new Date().getTime() / 1000;
    return await ctx.model.Account.update(info, {
      where: {
        mid: info.mid,
      },
    }).then(ret => {
      return ret[0];
    });
  }


}

module.exports = AccountService;
