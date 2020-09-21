// pages/receiveDetails/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHig:0,
    detailsArr:[],//详情信息
    addAssetArr:[],//添加的资产数据
    CompanyID:"",//公司id
    OperateID:"",//领用单子id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.OperateID)
    this.data.CompanyID = wx.getStorageSync("CompanyID");
    this.data.OperateID = options.OperateID
    this.getScrollHig()
    if(app.globalData.openId){
      this.detailsData()
    }else{
      app.callBackFn = this.detailsData
    }
  },
  getScrollHig(){//获取scroll列表高度
    var wid = wx.getSystemInfoSync().windowWidth;
    var hig = wx.getSystemInfoSync().windowHeight;
    var scrollHig = hig-560*wid/750-100*wid/750;
    this.setData({
      scrollHig:scrollHig
    })
    console.log(this.data.scrollHig)
  },

  detailsData(){
    var params = {
      CompanyID:this.data.CompanyID,
    }
    app.wxRequest(app.globalData.httpUrl+"/Mini_Takeover/Info",{OperateID:this.data.OperateID},(res)=>{
      console.log(res)
      if(res.code==1){
        if(res.Operate[0].ProcessTime){
          res.Operate[0].ProcessTime = res.Operate[0].ProcessTime.slice(0,10)+" "+res.Operate[0].ProcessTime.slice(11,19)
        }
        this.setData({
          detailsArr:res.Operate[0],
        })
      }
    },this,"POST",params)
  },
  skipAddAssset(){//跳转到添加资产页面
    wx.navigateTo({
      url: '/pages/addAssetList/addAssetList',
    })
  },
  saveFn(){//保存
    var params = {
      CompanyID:this.data.CompanyID,
    }
    var paramsID = [];
    for(var i=0;i<app.globalData.checkDataArr.length;i++){
      paramsID.push({AssetID:app.globalData.checkDataArr[i].AssetID})
    }
    paramsID = JSON.stringify(paramsID);
    console.log(paramsID)
    // return;
    app.wxRequest(app.globalData.httpUrl+"/Mini_Takeover/AddAsset",{param:paramsID,OperateID:this.data.OperateID},(res)=>{
      console.log(res)
      if(res.code==1){
        wx.redirectTo({
          url:"/pages/receive/receive"
        })
      }
    },this,"POST",params)
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
    console.log(app.globalData.checkDataArr)
    this.setData({
      addAssetArr:app.globalData.checkDataArr
    })
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
    app.globalData.checkDataArr = []
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