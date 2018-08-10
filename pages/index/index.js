//index.js
const { ajax } = getApp();
let timer = null
const countdown = 15000
Page({
  data: {
    rankList: wx.getStorageSync('__ALL_RANK__') || [],
    maxNodes: 500,
    totalStake: wx.getStorageSync('__TOTAL_STAKE__') || '',
    targetStake: 150000000,
    allStake: 1000000000,
    currentPerc: '',
    rankWidth: 0
  },
  onLoad () {
    if (!this.data.rankList.length) wx.showLoading({title: '加载中...'})
    if (wx.getStorageSync('__TOTAL_STAKE__')) {
      this.setData({
        rankWidth: (wx.getStorageSync('__TOTAL_STAKE__') / this.data.targetStake * 100).toFixed(4),
        currentPerc: (wx.getStorageSync('__TOTAL_STAKE__') / this.data.allStake * 100).toFixed(4)
      })
    }
  },
  onShow() {
    this.getRankRow()
    if (this.data.totalStake) this.getRankList(this.data.maxNodes)
    else this.getRankList(21)
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    timer = setInterval(() => {
      this.getRankRow()
      this.getRankList(this.data.maxNodes)
    }, countdown)
  },
  onPullDownRefresh () {
    this.getRankRow()
    this.getRankList(this.data.maxNodes)
    if (timer) {
      clearInterval(timer)
      timer = null
    }
    timer = setInterval(() => {
      this.getRankRow()
      this.getRankList(this.data.maxNodes)
    }, countdown)
  },
  onHide() {
    clearInterval(timer)
    timer = null
  },
  getVotes (votes) {
    const block_timestamp_epoch = 946684800000
    const timestamps = Date.now() / 1000
    const epoch = block_timestamp_epoch / 1000
    const weeks = 24 * 3600 * 7

    const weight = Math.floor((timestamps - epoch) / weeks) / 52

    const num = votes / Math.pow(2, weight) / 10000
    const formatNum = num.toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,').split('.')[0]
    return formatNum
  },
  getRankList(limit) {
    ajax.getRankList({
      limit: limit,
      json: true
    }).then(res => {
      const rankList = []
      const totalRate = Number(res.total_producer_vote_weight)
      res.rows.map(item => {
        rankList.push({
          owner: item.owner,
          votes: this.getVotes(Number(item.total_votes)),
          // votes: Number(item.total_votes),
          rate: (Number(item.total_votes) / totalRate * 100).toFixed(2)
        })
      })
      this.setData({
        rankList
      })
      if (limit == this.data.maxNodes) {
        wx.setStorageSync('__ALL_RANK__', rankList)
      } else {
        wx.hideLoading()
        this.getRankList(this.data.maxNodes)
      }
      wx.stopPullDownRefresh()
    })
  },
  getRankRow () {
    ajax.getRankRow({
      "table": "global", 
      "scope": "eosio", 
      "code": "eosio", 
      "json": "true"
    }).then(res => {
      const totalStake = res.rows[0]['total_activated_stake'] / 10000
      wx.setStorageSync('__TOTAL_STAKE__', totalStake)
      this.setData({
        totalStake,
        rankWidth: totalStake / this.data.targetStake * 100,
        currentPerc: (totalStake / this.data.allStake * 100).toFixed(4)
      })
    })
  },
  onPageNodes(event) {
    const id = event.currentTarget.dataset.nodes
    const index = Number(event.currentTarget.dataset.index) + 1
    wx.navigateTo({
      url: '/pages/nodes/index?id=' + id + '&index=' + index,
    })
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
