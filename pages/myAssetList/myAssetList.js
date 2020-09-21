// pages/myAssetList/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollHig:0,//资产列表高度
    chooseTap:["全部","在用","借用","维修"],//tap
    tapIndex:0,
    CompanyID:"",
    numArr:[1,2,3,4,5],
    assetListArr:[],//我的资产所有数据
    showListArr:[1],//根据筛选所展示的数据
    getInputValue:"",//获取搜索框的值
    noData:true,//未搜索到数据提示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.CompanyID = wx.getStorageSync("CompanyID")
    var wid = wx.getSystemInfoSync().windowWidth;
    var hig = wx.getSystemInfoSync().windowHeight;
    var scrollHig = hig-(100*wid/750+20*wid/750)*2;
    console.log(scrollHig)
    this.setData({
      scrollHig:scrollHig,
      tapIndex:parseInt(options.index)+1
    })
    if(app.globalData.openId){
      this.getAssetList()
    }else{
      app.callBackFn = this.getAssetList
    }
  },
  chooseTapFn(e){//点击tap筛选
    console.log(e)
    var index = e.currentTarget.dataset.index;
    this.setData({
      tapIndex:index,
    })
    var showList = [];
    if(this.data.tapIndex==0){
      this.setData({
        showListArr:this.data.assetListArr,
      })
    }else{
      for(var i=0;i<this.data.assetListArr.length;i++){
        if(this.data.tapIndex==1){
          if(this.data.assetListArr[i].StatusName=="在用"){
            showList.push(this.data.assetListArr[i])
          }
        }else if(this.data.tapIndex==2){
          if(this.data.assetListArr[i].StatusName=="借用"){
            showList.push(this.data.assetListArr[i])
          }
        }else if(this.data.tapIndex==3){
          if(this.data.assetListArr[i].StatusName=="维修"){
            showList.push(this.data.assetListArr[i])
          }
        }
      }
      this.setData({
        showListArr:showList
      })
      console.log(this.data.tapIndex)
      console.log(this.data.showListArr)
    }
  },
  getAssetList(){//获取我的资产列表
    app.wxRequest(app.globalData.httpUrl+"/Mini_Asset/MyList",{},(res)=>{
      if(res.code==1){
        // this.setData({
        //   assetListArr:res.Asset
        // })
        var showList = [];
        for(var i=0;i<res.Asset.length;i++){
          if(res.Asset[i].Headimg){
            res.Asset[i].Headimg = app.globalData.imgUrl+this.data.CompanyID+"/"+res.Asset[i].Headimg
          }
          if(this.data.tapIndex==1){
            if(res.Asset[i].StatusName=="在用"){
              showList.push(res.Asset[i])
            }
          }else if(this.data.tapIndex==2){
            if(res.Asset[i].StatusName=="借用"){
              showList.push(res.Asset[i])
            }
          }else{
            if(res.Asset[i].StatusName=="维修"){
              showList.push(res.Asset[i])
            }
          }
        }
        this.setData({
          showListArr:showList,
          assetListArr:res.Asset
        })
      }
    },this,"POST",{CompanyID:this.data.CompanyID})
  },

  getValue(e){//获取input框的值
    console.log(e.detail.value)
    this.data.getInputValue = e.detail.value;
  },
  searchData(){//通过搜索框搜索数据
    var showList = [];
    this.setData({
      showListArr:[]
    })
    for(var i=0;i<this.data.assetListArr.length;i++){
      var AssetName = this.data.assetListArr[i].AssetName;
      var AssetNo = this.data.assetListArr[i].AssetNo;
      if(AssetName.indexOf(this.data.getInputValue)!=-1 || AssetNo.indexOf(this.data.getInputValue)!=-1){
        showList.push(this.data.assetListArr[i])
      }
    }
    this.setData({
      showListArr:showList
    })
  },

  skipDetails(e){//跳转到资产详情
    var index = e.currentTarget.dataset.index
    console.log(index)
    wx.navigateTo({
      url: '/pages/assetDetails/assetDetails?scan=0'+"&AssetID="+this.data.showListArr[index].AssetID
    })
  },
  bindscrolltolower(){
    console.log("到底了")
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