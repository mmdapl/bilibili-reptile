'use strict';
const Subscription = require('egg').Subscription;

class CollectFollowingsInfo extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // cron: '12 38 3 * * * ', // 每天1点25执行
      // interval: '2m', // 1 分钟间隔
      type: 'worker', // all:指定所有worker执行，worker:随机指定一个worker执行
      disable: true,
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // 从基础用户表中获取mid
    await this.collectFollowingsInfoByAccountTable();


    // 生成随机数
    const collectFollowingsInfoByFollowingsTableIntervalTime = Math.floor(Math.random() * (20 - 5 + 1) + 5);
    // 从用户关注人表中获取mid
    setTimeout(async () => {
      await this.collectFollowingsInfoByFollowingsTable();
    }, 1000 * 60 * collectFollowingsInfoByFollowingsTableIntervalTime);


    // 生成随机数
    const collectFollowingsInfoByFollowersTableIntervalTime = Math.floor(Math.random() * (60 - 40 + 1) + 40);
    // 从用户粉丝表中获取mid
    setTimeout(async () => {
      await this.collectFollowingsInfoByFollowersTable();
    }, 1000 * 60 * collectFollowingsInfoByFollowersTableIntervalTime);


  }
  // 从用户账号表中收集用户的关注人列表信息
  async collectFollowingsInfoByAccountTable() {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 查询mid数组
    const midArrayRes = await ctx.service.account.getMidArray();

    if (midArrayRes && midArrayRes.code === 0) {
      // 对mid进行循环表里
      const midArray = midArrayRes.data;
      for (let index = 0; index < midArray.length; index++) {

        (i => {
          setTimeout(async () => {
            const element = midArray[i];
            // 获取该用户正在关注人的列表信息
            const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(element.mid, 1, 50);
            if (followingsInfo) {
              // 写入数据库
              const { total } = followingsInfo;
              // 分页遍历请求
              await this.collectFollowingsInfoByAccountTableForPage(element.mid, total);

            }
          }, i * 1000 * intervalTime);
        })(index);

      }
    }
  }

  async collectFollowingsInfoByAccountTableForPage(mid, total, order = 'desc') {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 循环请求【从第2页查询】
    for (let page = 1; page < total / 50 + 1; page++) {
      // 延时
      (i => {
        setTimeout(async () => {
          const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(mid, i, 50, order);
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

  async collectFollowingsInfoByFollowingsTable() {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 查询mid数组
    const midArrayRes = await ctx.service.followings.getMidArray();

    if (midArrayRes && midArrayRes.code === 0) {
      // 对mid进行循环表里
      const midArray = midArrayRes.data;
      for (let index = 0; index < midArray.length; index++) {

        (i => {
          setTimeout(async () => {
            const element = midArray[i];
            // 获取该用户正在关注人的列表信息
            const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(element.mid, 1, 50);
            if (followingsInfo) {
              // 写入数据库
              const { total } = followingsInfo;
              // 分页遍历请求
              await this.collectFollowingsInfoByFollowingsTableForPage(element.mid, total);

            }
          }, i * 3000 * intervalTime);
        })(index);

      }
    }
  }

  async collectFollowingsInfoByFollowingsTableForPage(mid, total, order = 'desc') {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 循环请求【从第2页查询】
    for (let page = 1; page < total / 50 + 1; page++) {
      // 延时
      (i => {
        setTimeout(async () => {
          const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(mid, i, 50, order);
          //
          if (followingsInfo) {
            const { list } = followingsInfo;
            // 循环写入到表中
            await this.updateOrCreateData(mid, list, 'followings');
          }
        }, i * 4000 * intervalTime);
      })(page);

    }
  }


  async collectFollowingsInfoByFollowersTable() {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 查询mid数组
    const midArrayRes = await ctx.service.followers.getMidArray();

    if (midArrayRes && midArrayRes.code === 0) {
      // 对mid进行循环表里
      const midArray = midArrayRes.data;
      for (let index = 0; index < midArray.length; index++) {

        (i => {
          setTimeout(async () => {
            const element = midArray[i];
            // 获取该用户正在关注人的列表信息
            const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(element.mid, 1, 50);
            if (followingsInfo) {
              // 写入数据库
              const { total } = followingsInfo;
              // 分页遍历请求
              await this.collectFollowingsInfoByFollowersTableForPage(element.mid, total);

            }
          }, i * 3000 * intervalTime);
        })(index);

      }
    }
  }

  /**
   *
   * @param {*} mid
   * @param {*} total
   * @param {*} order
   */
  async collectFollowingsInfoByFollowersTableForPage(mid, total, order = 'desc') {
    const { ctx } = this;
    // 生成动态计时
    const intervalTime = Math.floor(Math.random() * (5 - 1 + 1) + 1);
    // 循环请求【从第2页查询】
    for (let page = 1; page < total / 50 + 1; page++) {
      // 延时
      (i => {
        setTimeout(async () => {
          const followingsInfo = await ctx.service.reptile.getUpFollowingsInfo(mid, i, 50, order);
          if (followingsInfo) {
            const { list } = followingsInfo;
            // 循环写入到表中
            await this.updateOrCreateData(mid, list, 'followings');
          }
        }, i * 1000 * intervalTime);
      })(page);
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

module.exports = CollectFollowingsInfo;
