'use strict';

const Controller = require('egg').Controller;

class SearchController extends Controller {

  // 判断是否关注
  async isFollowingBSiteUp() {
    const { ctx, app } = this;
    ctx.validate({
      mid: { type: 'integer', required: true },
      upmid: { type: 'integer', required: true },
    }, ctx.query);
    const { mid, upmid } = ctx.query;
    // 判断用户是否存在
    const isExistMid = await ctx.axios({
      url: app.config.BSite.userInfoUrl,
      method: 'get',
      params: {
        mid,
        jsonp: 'jsonp',
        random: new Date().getTime(),
      },
    });
    if (!isExistMid || isExistMid.code !== 0) {
      ctx.body = await app.returnFormat(404, '用户信息不存在');
    }
    const isExistUpMid = await ctx.axios({
      url: app.config.BSite.userInfoUrl,
      method: 'get',
      params: {
        upmid,
        jsonp: 'jsonp',
        random: new Date().getTime(),
      },
    });
    if (!isExistUpMid || isExistUpMid.code !== 0) {
      ctx.body = await app.returnFormat(404, 'up用户信息不存在');
      return;
    }
    // 查询
    const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(mid, 1, 50);
    // 返回
    if (followingsInfo) {
      const { list } = followingsInfo;
      // 循环遍历判断
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        // 判断是否存在upmid
        if (upmid === element.mid) {
          ctx.body = await app.returnFormat(0, '正在关注');
          return;
        }
      }
      ctx.body = await app.returnFormat(1, '未关注');
    } else {
      ctx.body = await app.returnFormat(404, '用户信息不存在');
    }
  }

  // 获取账号详细信息
  async getUpAccountInfo() {
    const { ctx, app } = this;
    ctx.validate({
      mid: { type: 'integer', required: true },
    }, ctx.query);
    const { mid } = ctx.query;
    // 查询
    const accountInfo = await ctx.service.reptile.getUpPersonalInfo(mid);
    // 接口抛出

    ctx.body = await app.returnFormat(0, '操作成功', accountInfo);

    if (accountInfo) {
      const isExistUpInfo = await ctx.service.account.isExistUpInfo(mid);
      if (isExistUpInfo) {
        // 存在更新
        await ctx.service.account.update(accountInfo);
      } else {
        // 不存在创建
        await ctx.service.account.create(accountInfo);
      }
    }
  }

  async getUpFollowingsInfo() {
    const { ctx, app } = this;
    // 校验
    ctx.validate({
      mid: { type: 'integer', required: true },
      pn: { type: 'int', min: 1, required: false },
      ps: { type: 'int', min: 1, max: 50, required: false },
      order: { type: 'enum', values: [ 'desc', 'asc' ], required: false },
    }, ctx.query);
    //
    const { mid, pn = 1, ps = 50, order = 'desc' } = ctx.query;
    // 查询
    const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(mid, pn, ps, order);
    // 返回

    ctx.body = await app.returnFormat(0, '操作成功', followingsInfo);
    if (followingsInfo) {
      const { list } = followingsInfo;
      // 循环写入到表中
      for (let index = 0; index < list.length; index++) {
        (i => {
          // 定时
          setTimeout(async () => {
            const element = list[i];
            // 当前mid是否存在
            const isExistFollowerInfo = await ctx.service.followings.isExistFollowingInfo(mid, element.mid);
            // 添加account属性
            element.account = mid;
            if (isExistFollowerInfo) {
              // 更新
              await ctx.service.followings.update(element);
            } else {
              // 添加
              await ctx.service.followings.create(element);
            }
          }, i * 2000);
        })(index);
      }
    }
  }

  async getUpFollowersInfo() {
    const { ctx, app } = this;
    // 校验
    ctx.validate({
      mid: { type: 'integer', required: true },
      pn: { type: 'int', min: 1, required: false },
      ps: { type: 'int', min: 1, max: 50, required: false },
      order: { type: 'enum', values: [ 'desc', 'asc' ], required: false },
    }, ctx.query);
    //
    const { mid, pn = 1, ps = 50, order = 'desc' } = ctx.query;
    // 查询
    const followersInfo = await ctx.service.reptile.getUpFollowersInfo(mid, pn, ps, order);
    // 返回
    ctx.body = await app.returnFormat(0, '操作成功', followersInfo);
    if (followersInfo) {
      const { list } = followersInfo;
      // 循环写入到表中
      for (let index = 0; index < list.length; index++) {


        (i => {
          // 延时
          setTimeout(async () => {
            const element = list[i];
            // 当前mid是否存在
            const isExistFollowerInfo = await ctx.service.followers.isExistFollowerInfo(mid, element.mid);
            // 添加account属性
            element.account = mid;
            if (isExistFollowerInfo) {
              // 更新
              await ctx.service.followers.update(element);
            } else {
              // 添加
              await ctx.service.followers.create(element);
            }
          }, i * 1000);
        })(index);

      }
    }
  }

  // 粉丝列表信息同步
  async reptileTotalFollowers() {
    const { ctx, app } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    ctx.validate({
      mid: { type: 'integer', required: true },
    }, ctx.query);
    const { mid } = ctx.query;
    // 返回
    ctx.body = await app.returnFormat(0, '后台数据同步大约需要10分钟，请稍后查看');
    // 获取首页
    const followerFistPageInfo = await ctx.service.reptile.getUpFollowersInfo(mid, 1, 50);
    if (followerFistPageInfo) {
      const { total } = followerFistPageInfo;

      // 循环请求【从第2页查询】
      for (let page = 1; page < total / 50 + 1; page++) {
        // 延时
        (i => {
          setTimeout(async () => {
            const followersInfo = await ctx.service.reptile.getUpFollowersInfo(mid, i, 50);
            //
            if (followersInfo) {
              const { list } = followersInfo;
              // 循环写入到表中
              await this.updateOrCreateData(mid, list, 'followers');
            }
          }, i * 2000 * intervalTime);
        })(page);
      }
    }
  }

  // 关注人列表信息同步
  async reptileTotalFollowings() {
    const { ctx, app } = this;
    // 参数校验
    ctx.validate({
      mid: { type: 'integer', required: true },
    }, ctx.query);
    const { mid } = ctx.query;
    // 返回
    ctx.body = await app.returnFormat(0, '后台数据同步大约需要10分钟，请稍后查看');
    // 获取首页
    const followingFistPageInfo = await ctx.service.reptile.getUpFollowingsInfo(mid, 1, 50);
    if (followingFistPageInfo) {
      const { total } = followingFistPageInfo;
      // 生成动态计时
      const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
      // 循环请求【从第2页查询】
      for (let page = 1; page < total / 50 + 1; page++) {
        // 延时
        (i => {
          setTimeout(async () => {
            const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(mid, i, 50);
            //
            if (followingsInfo) {
              const { list } = followingsInfo;
              // 循环写入到表中
              await this.updateOrCreateData(mid, list, 'followings');
            }
          }, i * 2000 * intervalTime);
        })(page);
      }
    }
  }
  /**
   * 向关注人表或者粉丝表中写入数据
   * @param {integer} account 用户账号
   * @param {Array} list 用户正在关注人列表信息
   * @param {string} table 待操作的表，可选following follower
   */
  async updateOrCreateData(account, list, table = 'followings') {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    for (let index = 0; index < list.length; index++) {

      if (table === 'followings') {
        // 写入followings表
        (i => {
          setTimeout(async () => {
            const element = list[i];
            // 当前mid是否存在
            const isExistFollowingsInfo = await ctx.service.followings.isExistFollowingInfo(account, element.mid);
            // 添加account属性
            element.account = account;
            if (isExistFollowingsInfo) {
              // 更新
              await ctx.service.followings.update(element);
            } else {
              // 添加
              await ctx.service.followings.create(element);
            }
          }, i * 2000 * intervalTime);
        })(index);
      } else if (table === 'followers') {
        // 写入followers表
        (i => {
          setTimeout(async () => {
            const element = list[i];
            // 当前mid是否存在
            const isExistFollowerInfo = await ctx.service.followers.isExistFollowerInfo(account, element.mid);
            // 添加account属性
            element.account = account;
            if (isExistFollowerInfo) {
              // 更新
              await ctx.service.followers.update(element);
            } else {
              // 添加
              await ctx.service.followers.create(element);
            }
          }, i * 2000 * intervalTime);
        })(index);
      }
    }
  }
}

module.exports = SearchController;
