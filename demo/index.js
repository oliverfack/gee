const dataList = require("./data");//参与抽检展示品
import {getLuckDraw} from './api'; //调用接口返回中奖奖品 awardCode
Page({
  /**
   * 页面的初始数据
   */
  data: {
    awardList:[],  //来源于接口数据
    lucking:false, 
    activityCount:8,  //可抽奖次数
    currentIndex:2,  // 奖品位置
    awardResult: {
      awardCode: "",  //返回的结果
    },
    arr:[0,1,2,3,4,5,6,7,8,9]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   const list =  this.settingAward(dataList)
    this.setData({
      awardList:list
    })
      // console.log(this.awardList)
  },

// 设置奖项
settingAward(awardList) {
  const len = awardList.length;
  const award = {
  awardID:1,
  awardName: '谢谢参与',
  awardMoney: 0,
  awardType: '00',
  awardCode: ''
};
  let _awardList = [];
  if (len < 8) {
    for (let i = 0; i < 8 - len; i++) {
      awardList.push(JSON.parse(JSON.stringify(award)));
    }
    this.randArr(awardList);
    _awardList = awardList;
    console.log(_awardList)
  } else if (awardList.length == 8) _awardList = awardList;
  else {
    _awardList = awardList.splice(0, 9);
  }
  _awardList.splice(4, 0, {
    awardName: '立即抽奖'
  })
  console.log(_awardList)
  return _awardList;
},

// 随机打乱奖项
randArr(arr) {
  for (var i = 0; i < arr.length; i++) {
    var iRand = parseInt(arr.length * Math.random());
    var temp = arr[i];
    arr[i] = arr[iRand];
    arr[iRand] = temp;
  }
  return arr;
},

// 开始抽奖
startLuck() {
  const idArr = [0, 1, 2, 5, 8, 7, 6, 3];
  let cycles = 0;
  let that = this;
  let _awardList = this.data.awardList;
  let index = this.data.currentIndex;
  let activityCount = this.data.activityCount - 1;
  var interval = setInterval(frame, 100);
  this.setData({
    lucking: true,
    activityCount
  })
  let pending = true;


  getLuckDraw().then(res => {
    pending = false;
    console.log(res);
    this.setData({
      awardResult: {
        awardCode:res.awardCode,
        
      }
    })
  }).catch(err => {
    clearInterval(interval);
    pending = false;
    activityCount += 1;
    this.setData({
      activityCount,
      lucking: false,
    })
  })

  function frame() {
    if (!pending) {
      // 转三圈后跳到获奖位置
      if (cycles > 3) {
        console.log("_awardList[that.data.currentIndex].awardCode :"+_awardList[that.data.currentIndex].awardCode +"------------" +"that.data.awardResult.awardCode :"+that.data.awardResult.awardCode);
        if (_awardList[that.data.currentIndex].awardCode == that.data.awardResult.awardCode) {
          clearInterval(interval);
          that.setData({
            // lucking: false,
            showModal: true
          })
          return;
        }
      }
    }
    if (index == 8) {
      index = 0;
      if (!pending) {
        // 两圈后转盘减速
        if (cycles++ > 1) {
          clearInterval(interval);
          interval = setInterval(frame, 300);
        }
      }
    }
    // 设置奖项跳到对应位置
    that.setData({
      currentIndex: idArr[index++]
    })
  }
},


})



