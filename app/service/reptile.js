'use strict';

const Service = require('egg').Service;

// 请求头
const userAgents = [
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.12',
  'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0; Acoo Browser; SLCC1; .NET CLR 2.0.50727; Media Center PC 5.0; .NET CLR 3.0.04506)',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_3) AppleWebKit/535.20 (KHTML, like Gecko) Chrome/19.0.1036.7 Safari/535.20',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.71 Safari/537.1 LBBROWSER',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Win64; x64; Trident/5.0; .NET CLR 3.5.30729; .NET CLR 3.0.30729; .NET CLR 2.0.50727; Media Center PC 6.0) ,Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; .NET CLR 1.1.4322; .NET CLR 2.0.50727)',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1; SV1; QQDownload 732; .NET4.0C; .NET4.0E)',
  'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:2.0b13pre) Gecko/20110307 Firefox/4.0b13pre',
  'Opera/9.80 (Macintosh; Intel Mac OS X 10.6.8; U; fr) Presto/2.9.168 Version/11.52',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.8.0.12) Gecko/20070731 Ubuntu/dapper-security Firefox/1.5.0.13',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; LBBROWSER)',
  'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.8) Gecko Fedora/1.9.0.8-1.fc10 Kazehakase/0.5.6',
  'Mozilla/5.0 (X11; U; Linux; en-US) AppleWebKit/527+ (KHTML, like Gecko, Safari/419.3) Arora/0.6',
  'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; QQBrowser/7.0.3698.400)',
  'Opera/9.25 (Windows NT 5.1; U; en), Lynx/2.8.5rel.1 libwww-FM/2.14 SSL-MM/1.4.1 GNUTLS/1.2.9',
  'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
];

class ReptileService extends Service {


  async getUpFollowersInfo(mid, pn = 1, ps = 20, order = 'desc') {
    const { ctx, app } = this;
    // 获取up粉丝的用户信息
    const upFollowersInfo = await ctx.axios({
      url: app.config.BSite.userFansInfoUrl,
      method: 'get',
      params: {
        vmid: mid,
        pn, // 页数
        ps: ps > 50 ? 50 : ps, // 分页量
        order,
        jsonp: 'jsonp',
        random: new Date().getTime(),
      },
      headers: {
        'User-Agent': userAgents[Math.random() * userAgents.length],
        Referer: 'https://space.bilibili.com/',
      },
    });
    // 过滤数据
    if (upFollowersInfo && upFollowersInfo.code === 0) {
      return BSiteFollowDataHandler(upFollowersInfo.data);
    }
    // 报警提示
    return;
  }
  /**
   *
   * @param {bigint} mid 用户b站账号
   * @param {int} pn // 当前页
   * @param {int} ps // 一页数量 最大50
   * @param {string} order // 列表排序规则 默认desc ，按照关注用户的时间降序排列【即：最后关注最先显示】
   */
  async getUpFollowingsInfo(mid, pn = 1, ps = 20, order = 'desc') {
    const { ctx, app } = this;

    // 获取up当前正在关注的用户，并分页查询
    const upFollowingsInfo = await ctx.axios({
      url: app.config.BSite.userFollowUPInfoUrl,
      method: 'get',
      params: {
        vmid: mid,
        pn, // 页数
        ps: ps > 50 ? 50 : ps, // 分页量，
        order,
        jsonp: 'jsonp',
        random: new Date().getTime(),
      },
      headers: {
        'User-Agent': userAgents[Math.random() * userAgents.length],
        Referer: 'https://space.bilibili.com/',
      },
    });
    // 过滤数据
    if (upFollowingsInfo && upFollowingsInfo.code === 0) {
      return BSiteFollowDataHandler(upFollowingsInfo.data);
    }
    // 报警提示
    return;
  }

  async getUpPersonalInfo(mid) {
    const { ctx, app } = this;
    // 获取个人基础信息
    const baseInfo = await ctx.axios({
      url: app.config.BSite.userInfoUrl,
      method: 'get',
      params: {
        mid,
        jsonp: 'jsonp',
        random: new Date().getTime(),
      },
      headers: {
        'User-Agent': userAgents[Math.random() * userAgents.length],
        Referer: 'https://space.bilibili.com/',
      },
    });
    // 数据处理
    // 获赞量 阅读量 播放量
    const upStatInfo = await ctx.axios({
      url: app.config.BSite.userUpStatUrl,
      method: 'get',
      params: {
        mid,
        jsonp: 'jsonp',
        random: new Date().getTime(),
      },
      headers: {
        'User-Agent': userAgents[Math.random() * userAgents.length],
        Referer: 'https://space.bilibili.com/',
      },
    });
    // 关注量 被关注量
    const statInfo = await ctx.axios({
      url: app.config.BSite.userStatUrl,
      method: 'get',
      params: {
        vmid: mid,
        jsonp: 'jsonp',
        random: new Date().getTime(),
      },
      headers: {
        'User-Agent': userAgents[Math.random() * userAgents.length],
        Referer: 'https://space.bilibili.com/',
      },
    });
    // 过滤优化
    if (baseInfo && baseInfo.code === 0 && upStatInfo && upStatInfo.code === 0 && statInfo && statInfo.code === 0) {
      // 对数据进行统一处理
      return BSiteUpBaseDataHandler(baseInfo.data, upStatInfo.data, statInfo.data);
    }
    // 请求异常，报警处理

    // if(baseInfo.code!==0){
    //   return;
    // }
    // //
    // if(upStatInfo.code!==0){
    //   return;
    // }
    // //
    // if(statInfo.code!==0){
    //   return;
    // }

  }
}

module.exports = ReptileService;

/**
 * 用户基础信息处理
 * @param {Object} baseInfo 用户基础信息
 * @param {Object} upStatInfo  获赞量 阅读量 点赞量
 * @param {Object} statInfo 关注量被关注量
 */
function BSiteUpBaseDataHandler(baseInfo, upStatInfo, statInfo) {
  if (baseInfo && upStatInfo && statInfo) {
    return {
      mid: baseInfo.mid,
      name: baseInfo.name,
      sex: baseInfo.sex,
      face: baseInfo.face,
      sign: baseInfo.sign,
      rank: baseInfo.rank,
      level: baseInfo.level,
      jointime: baseInfo.jointime,
      moral: baseInfo.moral,
      silence: baseInfo.silence,
      birthday: baseInfo.birthday,
      coins: baseInfo.coins,
      fans_badge: baseInfo.fans_badge,
      official: JSON.stringify(baseInfo.official),
      vip: JSON.stringify(baseInfo.vip),
      pendant: JSON.stringify(baseInfo.pendant),
      nameplate: JSON.stringify(baseInfo.nameplate),
      is_followed: baseInfo.is_followed,
      top_photo: baseInfo.is_followed,
      theme: JSON.stringify(baseInfo.theme),
      sys_notice: JSON.stringify(baseInfo.sys_notice),
      archive_view: upStatInfo.archive.view,
      article_view: upStatInfo.article.view,
      likes: upStatInfo.likes,
      following_count: statInfo.following,
      whisper_count: statInfo.whisper,
      black_count: statInfo.black,
      follower_count: statInfo.follower,
    };
  }
  return;
}
/**
 * 处理对象数组
 * @param {Array} followListData 关注人/粉丝信息
 */
function BSiteFollowDataHandler(followListData) {
  if (followListData && followListData.list) {
    // 循环处理
    const finalListData = [];
    const list = followListData.list;
    for (let index = 0; index < list.length; index++) {
      const element = list[index];
      // 处理对象，转化为json
      element.official_verify = JSON.stringify(element.official_verify);
      element.vip = JSON.stringify(element.vip);
      element.tag = JSON.stringify(element.tag);
      // 重新将对象赋值给数组元素
      finalListData.push(element);
    }
    // 返回最后结果
    return { list: finalListData, total: followListData.total };
  }
  return;
}
