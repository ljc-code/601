// pages/receive/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CompanyID:"",
    receiveList:[],//领用数据列表
    scrollHig:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.CompanyID = wx.getStorageSync("CompanyID");
    this.getScrollHig();
    if(app.globalData.openId){
      this.getReceiveList()
    }else{
      app.callBackFn = this.getReceiveList
    }
  },
  getScrollHig(){//获取scroll列表高度
    var wid = wx.getSystemInfoSync().windowWidth;
    var hig = wx.getSystemInfoSync().windowHeight;
    var scrollHig = hig-100*wid/750;
    this.setData({
      scrollHig:scrollHig
    })
  },
  getReceiveList(){//获取领用列表
    var params = {
      CompanyID:this.data.CompanyID
    }
    app.wxRequest(app.globalData.httpUrl+"/Mini_Takeover/List",{},(res)=>{
      console.log(res)
      if(res.code==1){
        for(var i=0;i<res.Takeover.length;i++){
          if(res.Takeover[i].ProcessTime){
            res.Takeover[i].ProcessTime = res.Takeover[i].ProcessTime.slice(0,10)
          }
          if(res.Takeover[i].Status==0){
            res.Takeover[i].Status = "新建"
            res.Takeover[i].backColor = "#40E0D0"
          }else if(res.Takeover[i].Status==1){
            res.Takeover[i].Status = "驳回"
            res.Takeover[i].backColor = "#EE6363"
          }else if(res.Takeover[i].Status==2){
            res.Takeover[i].Status = "待批"
            res.Takeover[i].backColor = "#EEC900"
          }else{
            res.Takeover[i].Status = "完成"
            res.Takeover[i].backColor = "#32CD32"
          }
        }
        this.setData({
          receiveList:res.Takeover
        })
      }
    },this,"POST",params)
  },
  skipDetails(e){//跳转到领用详情
    var index = e.currentTarget.dataset.index;
    var OperateID = this.data.receiveList[index].OperateID
    wx.navigateTo({
      url: '/pages/receiveDetails/receiveDetails?OperateID='+OperateID,
    })
  },
  clickScan(){//扫码
    wx.scanCode({
      success (res) {
        console.log(res)
      }
    })
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