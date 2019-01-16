/**
 * @param {String} url
 * @description 从URL中解析参数
 */
exports.getParams = url => {
  const keyValueArr = url.split("?")[1].split("&");
  let paramObj = {};
  keyValueArr.forEach(item => {
    const keyValue = item.split("=");
    paramObj[keyValue[0]] = keyValue[1];
  });
  return paramObj;
};

exports.LOG = enable => {
  if (enable) {
    var log = console.log;
    return log;
  } else {
    return x => {};
  }
};
