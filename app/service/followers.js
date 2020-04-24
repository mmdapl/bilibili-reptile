'use strict';

const Service = require('egg').Service;

class FollowersService extends Service {
  async create(followers) {
    const { ctx } = this;
    // 添加create_time字段
    followers.create_time = new Date().getTime();
    return await ctx.model.Followers.create(followers).then(ret => {
      return ret ? { code: 0 } : { code: 1 };
    });
  }

  /**
   * 获取表中mid的集合
   */
  async getMidArray() {
    const { ctx } = this;
    return await ctx.model.Followers.findAll({
      raw: true,
      attributes: [ 'mid' ],
      group: 'mid',
    }).then(ret => {
      return { code: 0, data: ret };
    });
  }

  async isExistFollowerInfo(account, mid) {
    const { ctx } = this;
    return await ctx.model.Followers.findAll({
      raw: true,
      where: {
        mid,
        account,
      },
    }).then(ret => {
      return !!(ret && ret.length > 0);
    });
  }

  async update(info) {
    const { ctx } = this;
    // 添加修改时间
    info.modify_time = new Date().getTime() / 1000;
    return await ctx.model.Followers.update(info, {
      where: {
        account: info.account,
        mid: info.mid,
      },
    }).then(ret => {
      return ret[0];
    });
  }


}

module.exports = FollowersService;
