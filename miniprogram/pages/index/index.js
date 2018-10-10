//index.js
const app = getApp()
const util = require('../../utils/util.js')
const db = wx.cloud.database();
var userInfo = undefined;

Page({
  data: {
    userInfo: {},
    hasUserInfo: 0,
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    console.log("index onLoad")
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    userInfo = wx.getStorageSync("userInfo");
    if (userInfo) {
      this.setData({
        userInfo: userInfo,
        hasUserInfo: 1
      });
    }
  },

  tapAvatar: function(){
    console.log("avatar");
  },

  onGetUserInfo: function(e) {
    //通过按钮点击获取用户信息
    var _this = this;
    if (!this.logged && e.detail.userInfo) {
      console.log('onGetUserInfo: ' + e.detail.userInfo);
      wx.setStorage({
        key: 'userInfo',
        data: e.detail.userInfo
      })
      userInfo = e.detail.userInfo;
      this.setData({
        userInfo: userInfo,
        hasUserInfo: 1
      })
    }

    _this.signOut();
  },


  signOut: function() {
    var now = new Date();
    var signInTime = util.formatTime(now);
    var signInDay = util.formatDay(now);
    var _this = this;

    //判断今日是否已打过卡
    var signed = wx.getStorageSync("signed");
    if (signed && signed == signInDay) {
      wx.showModal({
        title: '打卡提醒',
        content: '今日已打卡，是否重新提交？',
        cancelText: '不要了',
        confirmText: '果断提交',
        success: function(res) {
          if (res.confirm) {
            _this.doSignOut(signInDay, signInTime, now);
          }
        }
      })
    } else {
      _this.doSignOut(signInDay, signInTime, now);
    }

  },

  doSignOut: function(signInDay, signInTime, now) {
    var _id = wx.getStorageSync("openid") + ":" + signInDay;
    db.collection("sign_out_records").doc(_id).set({
      data: {
        signInTime: signInTime,
        signInDay: signInDay,
        day: now.getDate(),
        month: now.getMonth() + 1,
        nickName: userInfo.nickName
      },
      success: function(res) {
        //今日打卡成功 存放标记
        wx.setStorage({
          key: 'signed',
          data: signInDay,
        })

        wx.showToast({
          title: '打卡成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          complete : function(){
            //打卡成功跳转
            wx.navigateTo({
              url: '../calendar/calendar'
            })
          }
        })

      }
    });
  }
})