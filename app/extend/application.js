'use strict';
/**
 * service 返回值封装，统一接口返回格式
 * @param {Integer} code   接口操作标记
 * @param {String} message  接口返回提示信息
 * @param {String||Array||Object} data 接口返回数据
 */
function returnFormat(code = 0, message = '操作成功', data = {
  qq: '2237221210',
  github: 'https://github.com/mmdapl/',
  message: '可联系作者或查看相关文档，祝您生活愉快~',
}) {
  return { code, message, data };
}
// 导出
module.exports = {
  returnFormat,
};
