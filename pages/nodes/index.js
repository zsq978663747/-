//index.js
const { ajax } = getApp();
Page({
  data: {
    showTabs: wx.getStorageSync('__SHOW_TABS__'),
    owner: '',
    index: '',
    producer: {},
    rankList: [],
    tabId: 0,
    nodeNum: 0,
    rankNum: 0,
  },
  onLoad() {
    if (!this.data.rankList.length) wx.showLoading({ title: '加载中...' })
  },
  onShow() {
    this.setData({
      owner: this.options.id,
      index: this.options.index
    })
    this.getNodesVote()
  },
  onPullDownRefresh () {
    if (tabId == 0) this.getNodesVote()
    else if (tabId == 1) this.getWithdrawal()

  },
  getNodesVote() {
    ajax.getNodesVote({
      node: this.options.id || 'eosstorebest'
    }).then(res => {
      const rankList = []
      res.voters.map(item => {
        rankList.push([
          item[0], item[1]['staked'] / 10000, item[1]['prod_num']
        ])
      })
      this.setData({
        producer: {
          percent: (res.percent * 100).toFixed(2),
          totalVotes: res.total_eos,
          totalVoter: res.voter_num,
        },
        rankList
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  getWithdrawal() {
    ajax.getNodesVote({
      compare: 'eosstorebest' || this.options.id
    }).then(res => {
      console.log('res', res)
      const rankList = []
      for (let key in res) {
        if (res[key]['status'] == 'deleted') {
          rankList.push([
            key,
            res[key]['staked']
          ])
        }
      }
      this.setData({
        rankList
      })
      wx.hideLoading()
      wx.stopPullDownRefresh()
    })
  },
  onTabs (event) {
    wx.showLoading({ title: '加载中...' })
    this.setData({
      rankList: []
    })
    const tabId = event.currentTarget.dataset.tab
    this.setData({ tabId: Number(tabId) })
    if (tabId == 0) this.getNodesVote()
    else if (tabId == 1) this.getWithdrawal()
  },
  onPageVoter(event) {
    const id = event.currentTarget.dataset.nodes
    wx.navigateTo({
      url: '/pages/voter/index?id=' + id,
    })
  },
  onTapShow (event) {
    if (this.data.showTabs) return
    const type = event.currentTarget.dataset.type
    const nodeNum = this.data.nodeNum
    const rankNum = this.data.rankNum
    if (nodeNum == 0 && type == 'node') {
      this.setData({ nodeNum: 1})
    }
    if (nodeNum == 1 && type == 'node') {
      this.setData({ nodeNum: 2 })
    }
    if (nodeNum == 2 && type == 'node') {
      this.setData({ nodeNum: 3 })
    }
    if (nodeNum == 3 && rankNum == 0 && type == 'rank') {
      this.setData({ rankNum: 1 })
    }
    if (nodeNum == 3 && rankNum == 1 && type == 'rank') {
      this.setData({ rankNum: 2 })
    } 
    if (nodeNum == 3 && rankNum == 2 && type == 'node') {
      this.setData({ nodeNum: 4 })
    }
    if (nodeNum == 4 && rankNum == 2 && type == 'node') {
      this.setData({ nodeNum: 5 })
    }
    if (nodeNum == 5 && rankNum == 2 && type == 'node') {
      this.setData({ nodeNum: 6 })
    }
    if (nodeNum == 6 && rankNum == 2 && type == 'rank') {
      this.setData({ rankNum: 3 })
    }
    if (nodeNum == 6 && rankNum == 3 && type == 'node') {
      this.setData({ showTabs: true})
      wx.setStorageSync('__SHOW_TABS__', true)
    }
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
