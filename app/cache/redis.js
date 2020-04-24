'use strict';

class Redis {
  /**
   * @description redis写入
   * @param {String} key 存值的键
   * @param {Object||Array} value 存入的值，一般为数组或者对象
   * @param {*} seconds 有效时间
   * @return 操作成功返回true，操作失败返回false
   */

  async set(redis, key, value, seconds) {
    value = JSON.stringify(value);
    if (redis) {
      if (!seconds) {
        await redis.set(key, value);
        return true;
      }
      // 设置有效时间
      await redis.set(key, value, 'EX', seconds);
      return true;
    }
    return false;
  }


  /**
   * @description 根据key来获取redis中的缓存值
   * @param {String} 存入缓存中的键
   * @returns 操作失败返回false,操作成功，返回json数据
   */

  async get(redis, key) {
    if (redis) {
      const data = await redis.get(key);
      return JSON.parse(data);
    }
    return false;
  }
  /**
   * 查询redis中所有的key
   * @param {Instance} redis redis的连接对象实例
   * @param {String} regStr 用于匹配key的值
   */
  async getKeys(redis, regStr = '*') {
    if (redis) {
      return await redis.keys(regStr);
    }
    return [];
  }
  /**
   * @description 直接清空redis缓存
   * @return 返回true
   */

  async flushAll(redis) {
    if (redis) {
      redis.flushall();
    }
    return true;
  }
  /**
   * @description 根据存入的键值对中的键，删除对应的值
   * @param {String} key
   * @return 操作成功返回true，操作失败返回false
   */

  async del(redis, key) {
    if (redis) {
      await redis.del(key);
      return true;
    }
    return false;
  }
  /**
   * @description 判断该key对应的值是否存在；
   * @param {String} key 键盘
   * @return 存在返回true，不存在返回false
   */

  async isExists(redis, key) {
    if (redis) {
      const data = await redis.exists(key);
      return data !== 0;
    }
    return false;
  }
  /**
   * @description 设置redis中键的过期时间
   * @param {String} key 键
   * @param {Integer} seconds 过期时间
   * @return 设置成功返回true，设置失败返回false
   */

  async expireTime(redis, key, seconds) {
    if (redis) {
      await redis.expire(key, seconds);
      return true;
    }
    return false;
  }
  /**
   * @description 按照查询的值，遍历redis进行查询；
   * @param {String} value 查询的值
   * @return 查询失败，返回false；查询成功，返回结果数组
   */

  async scanValue(redis, value) {
    let scanIndex = 0;
    // 查询结果数组
    let finalData = [];
    if (redis) {
      do {
        const scanResult = await redis.scan(scanIndex, 'MATCH', value, 'COUNT', '10');
        scanIndex = scanResult[0];
        finalData = finalData.concat(scanResult[1]);
      } while (scanIndex !== '0');
      return finalData;
    }
    return false;
  }
  /**
   *
   * @param {Instance} redis redis的连接对象实例
   * @param {String} key 哈希表映射的键
   * @param {String} filed 哈希表字段
   * @param {String} value 哈希表的值
   */
  async hSet(redis, key, filed, value) {
    if (redis) {
      // 实例存在
      await redis.hset(key, filed, value);
    }
  }
  async getHSetLen(redis, key) {
    if (redis) {
      return await redis.hlen(key);
    }
    return 0;
  }
  /**
   * 遍历获取hset中指定键的指定数据量
   * @param {Instance} redis redis的连接对象实例
   * @param {String} key
   * @param {int} cursorIndex 游标的起始位置，第一次查默认为0
   * @param {int} count 遍历查询的数据量
   */
  async getHScanValue(redis, key, cursorIndex = 0, count = 10) {
    if (redis) {
      const result = await redis.hscan(key, cursorIndex, [ 'count', count ]);
      return result[1];
    }
    return [];
  }
  // async hget(redis,key,)
  /**
   * 批量删除redis中key对应的多个field值
   * @param {Instance} redis redis的连接对象实例
   * @param {String} key redis哈希表的键
   * @param {Array} fieldArr 哈希表一行数据的键组成的数组；
   */
  async batchDelHSet(redis, key, fieldArr) {
    if (redis) {
      redis.hdel(key, fieldArr);
    }
  }
}

module.exports = Redis;
