//app.js
App({
  onLaunch: function() {
    console.log("app onLaunch")
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

  },
  onShow: function() {
    console.log("app onShow")
    const _this = this;

    wx.getStorage({
        key: 'openid',
        complete: function(res) {
          console.log('app getStorage openid:' + res.data);

          if (!res.data) {
            wx.cloud.callFunction({
              name: 'login',
              data: {},
              success: res => {
                console.log('[云函数] [login] user openid: ', res.result.openid)

                wx.setStorage({
                  key: 'openid',
                  data: res.result.openid,
                })
              },
              fail: err => {
                console.error('[云函数] [login] 调用失败', err)
                wx.navigateTo({
                  url: '../deployFunctions/deployFunctions',
                })
              }
            })
          }
        }
      }),
      this.globalData = {}
  }
})