// pages/assetDetails/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    basicArr:[//基本信息
      {basicKey:"购置价格",basicValue:""},
      {basicKey:"损耗周期",basicValue:""},
      {basicKey:"使用公司",basicValue:""},
      {basicKey:"使用部门",basicValue:""},
      {basicKey:"使用人",basicValue:""},
      {basicKey:"区域",basicValue:""},
      {basicKey:"存放地点",basicValue:""},
    ],
    deviceMessArr:[],//全部数据
    CompanyID:"",
    AssetID:"9a19c39f-9b92-43cf-9818-2371db75423f",
    AssetNo:"",
    messHig:0,//基本信息高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.scan = options.scan;
    this.data.CompanyID = wx.getStorageSync("CompanyID");
    // this.data.AssetID = options.AssetID;
    // this.data.AssetNo = options.AssetNo;

    var wid = wx.getSystemInfoSync().windowWidth;
    var hig = wx.getSystemInfoSync().windowHeight;
    this.setData({
      messHig:hig-490*wid/750-40*wid/750
    })
    console.log(this.data.messHig)
    if(app.globalData.openId){
      this.getDetailsData();
    }else{
      app.callBackFn = this.getDetailsData
    }
  },

  getDetailsData(){//获取资产详情数据
    var params = {
      CompanyID:this.data.CompanyID,
    };
    var paramsData = {
      AssetID:this.data.AssetID,
      AssetNo:this.data.AssetNo
    }
    var URL = "";
    if(this.data.scan=="0"){
      URL = "/Mini_Asset/Info"
    }else{
      URL = "/Mini_Asset/Scan"
    }
    app.wxRequest(app.globalData.httpUrl+URL,paramsData,(res)=>{
      console.log(res)
      if(res.code==1){
        
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