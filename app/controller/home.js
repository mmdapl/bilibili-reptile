'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const account = 350937042;
    const res = await ctx.service.reptile.getUpPersonalInfo(account);
    // 查询是否存在
    const { mid } = res;
    if (mid) {
      const isExistUpInfo = await ctx.service.account.isExistUpInfo(mid);
      if (isExistUpInfo) {
        // 存在更新
        await ctx.service.account.update(res);
      } else {
        // 不存在创建
        await ctx.service.account.create(res);
      }
    }


    // 正在关注人信息
    const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(account, 1, 50);
    if (followingsInfo) {
      const { list, total } = followingsInfo;
      // 循环写入到表中
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
        // 当前mid是否存在
        const isExistFollowerInfo = await ctx.service.followings.isExistFollowingInfo(account, element.mid);
        // 添加account属性
        element.account = account;
        if (isExistFollowerInfo) {
          // 更新
          await ctx.service.followings.update(element);
        } else {
          // 添加
          await ctx.service.followings.create(element);
        }
      }
    }
    // 粉丝信息
    const followersInfo = await ctx.service.reptile.getUpFollowersInfo(account, 1, 50);
    if (followersInfo) {
      const { list, total } = followersInfo;
      // 循环写入到表中
      for (let index = 0; index < list.length; index++) {
        const element = list[index];
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
      }
    }
    ctx.body = { code: 0, data: {
      followersInfo, followingsInfo,
    } };
  }
}

module.exports = HomeController;
