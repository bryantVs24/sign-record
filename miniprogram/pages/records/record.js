// pages/records/record.js

const util = require('../../utils/util.js')
const db = wx.cloud.database();

Page({

  /**
   * 页面的初始数据
   */
  data: {
      records:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    const app = getApp();
    console.log("record onLoad")
    var _this = this;
    db.collection("sign_out_records").where({
      month: new Date().getMonth() + 1
    }).get({
      success: function (res) {
        console.log(res.data);
        _this.setData({ records: res.data })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("record onShow")
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})