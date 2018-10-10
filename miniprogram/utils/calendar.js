function Calendar(options) {
  return this.initData(options);
}

/**
 *
 * @type {{initData: Calendar.initData, _getDayCountOfMonth: Calendar._getDayCountOfMonth, refreshData: Calendar.refreshData}}
 */
Calendar.prototype = {
  initData: function (options) {
    var self = this;
    //获取今天日期
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    //周日为0
    var day = now.getDay();
    var date = now.getDate();

    //获取本月第一天星期几
    var firstDayOfMonth = new Date(Date.parse(year + '/' + month + '/01'));
    //周日为0
    var firstDay = firstDayOfMonth.getDay();

    //获取本月天数
    var curMonthDayCount = self.getDayCountOfMonth(year, month);

    //获取上个月天数
    var preMonth = month - 1;
    var preMonthYear = preMonth == 0 ? (year - 1) : year;
    var preMonthDayCount = self.getDayCountOfMonth(preMonthYear, preMonth);

    //展示上月的天数
    var days = [];
    var i;
    for (i = firstDay; i > 0; i--) {
      days.push({ m: preMonth, d: preMonthDayCount - i + 1 });
    }

    //本月天数
    for (i = 1; i <= curMonthDayCount; i++) {
      days.push({ m: month, d: i });
    }

    //下月天数
    for (i = 1; i <= 42 - curMonthDayCount - firstDay; i++) {
      days.push({ m: month + 1, d: i });
    }


    var signDataObj = {};
    options.signData.forEach(function (v, i, arr) {
      signDataObj[v['day']] = v['signInTime'];
    });


    //构造展示数据
    var data = [];
    var avaDate = new Date('2018/01/01 20:30:00');
    for (var row = 0; row < 6; row++) {
      var rowData = [];
      for (var col = 0; col < 7; col++) {
        var day = days[row * 7 + col];
        if (day.m == month) {
          var signTime = signDataObj[day.d];
          var signDate = new Date("2018/01/01 " + signTime);

          rowData.push({ m: month, d: day.d, time: signTime, enough: signDate > avaDate });
        } else {
          rowData.push({ m: day.m, d: day.d, time: '' });
        }
      }

      data.push(rowData);
    }

    return data;
  },

  /**
   * 将1,2,3,4,5格式化01,02,03,04,05
   * @param {Object} 日转换
   */
  tod: function (d) {
    if (parseInt(d) < 9) {
      d = "0" + parseInt(d);
    }
    return d;
  },

  _inArray: function (str, arr) {
    // 不是数组则抛出异常 
    if (!Array.isArray(arr)) {
      throw "arguments is not Array";
    }
    // 遍历是否在数组中 
    for (var i = 0, k = arr.length; i < k; i++) {
      if (str == arr[i]) {
        return true;
      }
    }
    // 如果不在数组中就会返回false 
    return false;
  },

  getDayCountOfMonth: function (y, m) {
    var self = this;
    if (y == undefined || y == null) {
      throw "=====获取当前月份天数时，缺少y参数，未定义！=======";
    }
    if (m == undefined || m == null) {
      throw "=====获取当前月份天数时，缺少m参数，未定义！=======";
    }
    var y = parseInt(y);
    var m = parseInt(m);
    if (m == 0) {
      y--;
      m = 12;
    }
    if (m == 2) {
      if ((y % 4 == 0 && y % 100 != 0) || (y % 400 == 0)) {
        return '29';
      } else {
        return '28';
      }
    } else {
      if (self._inArray(m, [1, 3, 5, 7, 8, 10, 12])) {
        return '31';
      } else {
        return '30';
      }
    }

  }

};


module.exports = Calendar;