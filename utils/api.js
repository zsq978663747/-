import Promise from 'promise.js'
import apiUrl from 'parm.js'
import util from 'util.js'

const ajaxData = (url, type = 'GET') => {
  return ((params = {}) => {
    return new Promise((resolve, reject) => {
      wx.request({
        url: url,
        data: params,
        method: type === 'post' ? 'POST' : type,
        success(res){
          if (res.data && res.statusCode === 200) {
            resolve(res.data)
            setTimeout(() => {
              // wx.hideToast()
            }, 300)
          } else {
            // wx.hideToast()
            // wx.showModal({
            //   title: '提示',
            //   content: res.data.error || res.data.msg || '',
            //   showCancel: false,
            // });
            // resolve(res.data)
          }
        },
        fail(res) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: JSON.stringify(res),
            showCancel: false,
          });
          // reject(res)
        }
      });
    });
  });
}


const exportApi = {}
for (let obj in apiUrl) {
  let url = apiUrl[obj].split('|')[0]
  let method = apiUrl[obj].split('|')[1] || 'post'
  if (apiUrl[obj].indexOf('http') !== -1) {
    exportApi[obj] = ajaxData(url, method)
  } else {
    exportApi[obj] = apiUrl[obj]
  }
}

export default exportApi

