'use strict';
const Subscription = require('egg').Subscription;

class CollectAccountInfo extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    // const { app } = this;
    return {
      cron: '38 25 1 * * *', // 每天1点25执行
      // interval: '1m', // 1 分钟间隔
      type: 'worker', // all:指定所有worker执行，worker:随机指定一个worker执行
      disable: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // 从基础用户列表中收集【即更新当前用户列表】
    await this.collectAccountInfoBase();

    // 根据关注人列表的用户id进行收集【从关注人列表里面收集】
    // 生成5-10之间的随机整数
    // const getAccountInfoByFollowingsListIntervalTime = Math.floor(Math.random() * (10 - 5 + 1) + 5);
    setTimeout(async () => {
      await this.getAccountInfoByFollowingsList();
    }, 1000 * 60 * 1);

    // 根据粉丝列表的用户mid进行收集【从粉丝列表维度收集用户】
    // 生成15-20之间的随机整数
    // const getAccountInfoByFollowersListIntervalTime = Math.floor(Math.random() * (20 - 15 + 1) + 15);
    setTimeout(async () => {
      await this.getAccountInfoByFollowersList();
    }, 1000 * 60 * 4);
  }

  /**
   * 收集并更新用户基本信息
   */
  async collectAccountInfoBase() {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 获取accout表中mid
    const midArrayRes = await ctx.service.account.getMidArray();
    if (midArrayRes && midArrayRes.code === 0) {
      // mid数组
      const midArray = midArrayRes.data;
      // 根据数组循环
      for (let index = 0; index < midArray.length; index++) {
        (i => {
          const element = midArray[i];
          // 爬取用户数组，每隔2s
          setTimeout(async () => {
            const res = await ctx.service.reptile.getUpPersonalInfo(element);
            // 数据存在，怎更新到account中
            if (res) {
              // 更新数据
              await ctx.service.account.update(res);
            }
          }, i * 3000 * intervalTime);
        })(index);

      }
    }
  }

  /**
   * 从用户关注人列表里爬取出用户信息
   */
  async getAccountInfoByFollowingsList() {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 获取收信人列表里，用户b站mid数组
    const midArrayRes = await ctx.service.followings.getMidArray();
    if (midArrayRes && midArrayRes.code === 0) {
      // mid数组
      const midArray = midArrayRes.data;
      // 根据数组循环
      for (let index = 0; index < midArray.length; index++) {
        // 闭包
        (i => {
          const element = midArray[i];
          // 爬取用户数组，每隔2s
          setTimeout(async () => {
            const res = await ctx.service.reptile.getUpPersonalInfo(element.mid);
            // 获取到最新的用户数据
            if (res) {
              // 判断account中是否存在用户数据
              const isExistUpInfo = await ctx.service.account.isExistUpInfo(res.mid);
              // 存在更新
              if (isExistUpInfo) {
                // 更新数据
                await ctx.service.account.update(res);
              } else {
                // 不存在，添加
                await ctx.service.account.create(res);
              }
            }
          }, i * 4000 * intervalTime);
        })(index);
      }
    }
  }
  /**
   * 从用户的粉丝表里面，获取粉丝用户的B站mid，并更新到用户表中
   */
  async getAccountInfoByFollowersList() {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    const midArrayRes = await ctx.service.followers.getMidArray();
    if (midArrayRes && midArrayRes.code === 0) {
      // mid数组
      const midArray = midArrayRes.data;
      // 根据数组循环
      for (let index = 0; index < midArray.length; index++) {
        (i => {
          const element = midArray[i];
          // 爬取用户数组，每隔2s
          setTimeout(async () => {
            const res = await ctx.service.reptile.getUpPersonalInfo(element.mid);
            // 获取到最新的用户数据
            if (res) {
              // 判断account中是否存在用户数据
              const isExistUpInfo = await ctx.service.account.isExistUpInfo(res.mid);
              // 存在更新
              if (isExistUpInfo) {
                // 更新数据
                await ctx.service.account.update(res);
              } else {
                // 不存在，添加
                await ctx.service.account.create(res);
              }
            }
          }, i * 2000 * intervalTime);
        })(index);
      }
    }
  }
}

module.exports = CollectAccountInfo;

