//index.js
const { ajax } = getApp();
function sortNumber(a, b) {
  return b['pecent'] - a['pecent']
}
Page({
  data: {
    producers: [],
    nodesName: ''
  },
  onLoad() {
    this.setData({nodesName: this.options.id})
    if (!this.data.producers.length) wx.showLoading({ title: '加载中...' })
  },
  onShow() {
    this.getNodesVote()
  },
  onPullDownRefresh () {
    this.getNodesVote()
  },
  getNodesVote() {
    ajax.getNodesVote({
      voter: this.options.id
    }).then(res => {
      const producers = []
      res.producers.sort(sortNumber)
      res.producers.map(item => {
        item['pecent'] = (item['pecent'] * 100).toFixed(2)
      })
     
      this.setData({
        producers: res.producers,
        staked: res.staked / 10000,
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  getVotes(votes) {
    const block_timestamp_epoch = 946684800000
    const timestamps = Date.now() / 1000
    const epoch = block_timestamp_epoch / 1000
    const weeks = 24 * 3600 * 7

    const weight = Math.floor((timestamps - epoch) / weeks) / 52

    const num = votes / Math.pow(2, weight) / 10000
    const formatNum = num.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').split('.')[0]
    return formatNum
  },
  // 用户点击右上角分享
  onShareAppMessage(msg) {
    return {
      title: '柚子节点排行',
      path: '/pages/index/index',
      imageUrl: '', // 215:168
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
