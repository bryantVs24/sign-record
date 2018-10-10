//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
const db = wx.cloud.database();


Page({
  data: {
    userInfo: {}
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      console.log('onGetUserInfo: ' + e.detail.userInfo);
      app.globalData.userInfo = e.detail.userInfo
    }

    var now = new Date();
    var signInTime = util.formatTime(now);
    var signInDay = util.formatDay(now);
    var _id = wx.getStorageSync("openid") + ":" + signInDay;
    db.collection("sign_out_records").doc(_id).set({
      data:{
        signInTime: signInTime,
        signInDay: signInDay,
        day : now.getDate(),
        month : now.getMonth() + 1,
        nickName: app.globalData.userInfo.nickName
      },
      success: function (res) {
        console.log(res.data)
      }
    });
    // db.collection("sign_out_records").add({
    //   data: {
    //     signInTime: signInTime,
    //     signInDay: signInDay,
    //     nickName: app.globalData.userInfo.nickName
    //   }
    // });

    wx.redirectTo({
      url: '../calendar/calendar'
    })

  },
  onLoad: function () {
    
  }
})
