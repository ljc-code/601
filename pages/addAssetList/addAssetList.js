// pages/addAssetList/addAssetList.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    CompanyID:"",
    getInputValue:"",//搜索框的值
    dataList:[],//资产列表数据
    scrollHig:0,
    checkArr:[],//选中的数据
    checkAll:"全选",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.checkArr = app.globalData.checkDataArr
    this.getScrollHig();
    this.data.CompanyID = wx.getStorageSync("CompanyID");
    if(app.globalData.openId){
      this.getAssetData()
    }else{
      app.callBackFn = this.getAssetData
    }
  },
  getScrollHig(){//获取scroll列表高度
    var wid = wx.getSystemInfoSync().windowWidth;
    var hig = wx.getSystemInfoSync().windowHeight;
    var scrollHig = hig-120*wid/750-100*wid/750;
    this.setData({
      scrollHig:scrollHig
    })
  },

  getAssetData(inputValue){//获取资产列表数据
    console.log("搜索")
    if(!inputValue){
      inputValue=""
    }
    var params = {
      CompanyID:this.data.CompanyID,
    }
    app.wxRequest(app.globalData.httpUrl+"/Mini_Asset/List",{Keys:inputValue},(res)=>{
      console.log(res)
      if(res.code==1){
        for(var i=0;i<res.Asset.length;i++){
          res.Asset[i].check = false;
          if(res.Asset[i].Headimg){
            res.Asset[i].Headimg = app.globalData.imgUrl+this.data.CompanyID+"/"+res.Asset[i].Headimg
          }
        }
        this.setData({
          dataList:res.Asset
        })
        this.showCheck();
      }
      // console.log(this.data.dataList)
    },this,"POST",params)
  },
  checkFn(e){//选中与取消
    this.data.checkArr = app.globalData.checkDataArr;
    var index = e.currentTarget.dataset.index
    this.data.dataList[index].check = !this.data.dataList[index].check;
    var changeList = this.data.dataList;
    this.setData({
      dataList:changeList
    })
    if(this.data.dataList[index].check){
      this.data.checkArr.push(this.data.dataList[index])
    }else{
      for(var i=0;i<this.data.checkArr.length;i++){
        if(this.data.dataList[index].AssetID == this.data.checkArr[i].AssetID){
          this.data.checkArr.splice(i,1);
        }
      }
    }
    console.log(this.data.checkArr)
  },
  checkAllFn(){//全选与取消
    if(this.data.checkAll=="全选"){
      var changeList = [];
      for(var i=0;i<this.data.dataList.length;i++){
        this.data.dataList[i].check = true
      }
      changeList = this.data.dataList
      this.data.checkArr = this.data.dataList
      this.setData({
        checkAll:"取消",
        dataList:changeList
      })
    }else{
      var changeList = [];
      for(var i=0;i<this.data.dataList.length;i++){
        this.data.dataList[i].check = false
      }
      changeList = this.data.dataList
      this.data.checkArr = []
      this.setData({
        checkAll:"全选",
        dataList:changeList,
      })
    }
  },
  affirmCheck(){//确认选中
    app.globalData.checkDataArr = this.data.checkArr
    console.log(app.globalData.checkDataArr)
    wx.navigateBack({
      delta: 1,
    })
  },

  showCheck(){//确认选中之后再次进来显示选中的状态
    console.log(app.globalData.checkDataArr)
    var checkDataArr = []
    for(var i=0;i<this.data.dataList.length;i++){
      for(var j=0;j<app.globalData.checkDataArr.length;j++){
        if(app.globalData.checkDataArr[j].AssetID == this.data.dataList[i].AssetID){
          this.data.dataList[i].check = true
        }
      }
    }
    checkDataArr = this.data.dataList
    this.setData({
      dataList:checkDataArr
    })
  },

  getValue(e){//获取input框的值
    console.log(e.detail.value)
    this.data.getInputValue = e.detail.value;
  },
  searchData(){//通过搜索框搜索数据
    this.getAssetData(this.data.getInputValue)
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