// miniprogram/pages/calendar/calendar.js
const Calendar = require('../../utils/calendar.js')
const db = wx.cloud.database();
const app = getApp();

const date = new Date()
const hours = []
const mins = []
const seconds = []

//要修改的时间
var updateTime = undefined
var updateDay = undefined
var userInfo = undefined;



for (let i = 0; i <= 23; i++) {
  hours.push(i)
}

for (let i = 0; i <= 59; i++) {
  mins.push(i)
}

for (let i = 0; i <= 59; i++) {
  seconds.push(i)
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    signData: [],
    month: new Date().getMonth() + 1,
    avaTime: "20:30:00",
    enough : true,

    hours: hours,
    mins: mins, 
    seconds: seconds,
    value: ['20', '30', '00'],
    showModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("calendar onLoad")

    userInfo = wx.getStorageSync("userInfo");

    var _this = this;
    var month = new Date().getMonth() + 1;
    db.collection("sign_out_records").where({
      month: month
    }).get({
      success: function(res) {
        console.log("calendar onLoad:" + res.data);
       
        var data = new Calendar({
          signData: res.data
        });
        console.log("calendar result: " + data);

        var avaTime = _this.calAvarageTime(res.data);

        //比较平均时间
        var avaTimeDate = new Date('2018/01/01 ' + avaTime);
        var fixedDate = new Date("2018/01/01 20:30:00");

        _this.setData({
          signData: data,
          month: month,
          avaTime: avaTime,
          enough: avaTimeDate > fixedDate
        });

      }
    });
  },

  calAvarageTime(signData) {
    var hourSum = 0;
    var minSum = 0;
    var secSum = 0;
    signData.forEach(function(v, i, arr) {
      var times = v['signInTime'].split(":");
      hourSum += parseInt(times[0]);
      minSum += parseInt(times[1]);
      secSum += parseInt(times[2]);
    });
    var num = signData.length;
    if(num < 1) return "- : - : -";
    secSum = (hourSum * 3600 + minSum * 60 + secSum) / num;
    var avaHour = this.tod(Math.floor(secSum / 3600));
    var avaMin = this.tod(Math.floor((secSum % 3600) / 60));
    var avaSec = this.tod(Math.floor((secSum % 3600) % 60));

    var avaTime = avaHour + ":" + avaMin + ":" + avaSec;

    return avaTime;
  },

  tod: function(d) {
    if (parseInt(d) < 10) {
      d = "0" + parseInt(d);
    }
    return d;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("calendar onShow")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  preventTouchMove: function () {

  },

  bindChange: function(e){
    const val = e.detail.value
    console.log(val);
    if(val && val.length > 1){
      updateTime = this.tod(val[0]) + ":" + this.tod(val[1]) + ":" + this.tod(val[2]);
    }
    console.log("updateTime:" +updateTime);
  }, 

  showTime(e){
    
    console.log(e.currentTarget.dataset.day)
    console.log(e.currentTarget.dataset.time)

    updateDay = this.tod(e.currentTarget.dataset.day);

    var time = e.currentTarget.dataset.time

    updateTime = time? time : "20:30:00";

    this.setData({
      value: time ? time.split(":") : ['20', '30', '00'],
      showModal: true
    });
  },

  cancelUpdate(){
    updateTime = undefined
    updateDay = undefined
    this.setData({
      showModal: false
    });
  },

  toUpdate(){
    var _this = this;
    wx.showModal({
      title: '提醒',
      content: '修改' + updateDay + "号下班时间为\n" + updateTime,
      cancelText: '取消',
      confirmText: '提交',
      success: function (res) {     
        if (res.confirm) {
          _this.doUpdateTime();
        }
      }
    })
  },

  toClearTime(){
    var _this = this;
    wx.showModal({
      title: '提醒',
      content: '确定清空' + updateDay + "号打卡？？？" ,
      cancelText: '取消',
      confirmText: '确定',
      success: function (res) {
        if (res.confirm) {
          _this.doClearTime();
        }
      }
    })
  },

  doClearTime(){
    var _this = this;

    var signInDay = this.tod(date.getFullYear()) + "/" + this.tod(date.getMonth() + 1) + "/" + updateDay;
    var _id = wx.getStorageSync("openid") + ":" + signInDay;

    db.collection("sign_out_records").doc(_id).remove({
      success: function (res) {
        updateTime = undefined
        updateDay = undefined
        _this.setData({
          showModal: false
        });
        wx.showToast({
          title: '已置空',
          icon: 'success',
          duration: 2000,
          mask: true,
          complete: function () {
            //打卡成功跳转
            _this.onLoad();
          }
        })

      }
    });
  },

  doUpdateTime(){
    var _this = this;
    console.log("修改日期"+ updateDay + "时间：" + updateTime)

    var signInDay = this.tod(date.getFullYear()) + "/" + this.tod(date.getMonth() + 1) + "/" +  updateDay;
    var _id = wx.getStorageSync("openid") + ":" + signInDay;
 
    db.collection("sign_out_records").doc(_id).set({
      data: {
        signInTime: updateTime,
        signInDay: signInDay,
        day: parseInt(updateDay),
        month: date.getMonth() + 1,
        nickName: userInfo.nickName
      },
      success: function (res) {
        updateTime = undefined
        updateDay = undefined
        _this.setData({
          showModal: false
        });
        wx.showToast({
          title: '修改成功',
          icon: 'success',
          duration: 2000,
          mask: true,
          complete: function () {
            //打卡成功跳转
           _this.onLoad();
          }
        })

      }
    });


  }
})