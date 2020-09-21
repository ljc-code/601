//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    manage:[],//资产管理
    consumeManage:[],//耗材管理
    userData:[],//用户资料
    register:0,//是否登录
    registerPhone:"",//登录手机号
    companyArr:[],//名下公司
    companyArrAll:[],//用户公司信息
    pickerIndex:0,//picker展示内容的下标
    propertyState:false,//判断我的资产显示
    myPropertyArr:[],//我的资产
  },
  //事件处理函数
  onLoad: function () {
    if(app.globalData.openId){
      this.getUserInfo()
    }else{
      app.callBackFn = this.getUserInfo
    }
  },

  
  getUserInfo(){//获取用户资料
    app.wxRequest(app.globalData.httpUrl+"/Mini/SelectUser",{},(res)=>{
      console.log(res)
      var manage=[];
      var consumeManage=[];
      for(var i=0;i<res.Menu.length;i++){
        res.Menu[i].Icon = "../image/index/"+res.Menu[i].Icon
        if(res.Menu[i].MenuTitle=="资产"){
          manage.push(res.Menu[i])
        }else if(res.Menu[i].MenuTitle=="耗材"){
          consumeManage.push(res.Menu[i])
        }
      }
      this.setData({
        manage:manage,
        consumeManage:consumeManage
      })
      this.data.userData = res
    },this,"POST");
  },
  clickCenter(){//进入个人中心

  },
  clickMessage(){//进入消息中心

  },
  clickScan(){//扫码
    wx.scanCode({
      success (res) {
        console.log(res)
      }
    })
  },
  clickManage(e){//资产管理
    console.log(e)
    if(this.data.register==0){
      wx.showToast({
        title: '请先登录',
        icon:"none",
        duration:2000
      })
      return;
    }
    var index = e.currentTarget.dataset.index;
    switch(index) {
      case 0:
        wx.navigateTo({
          url: '/pages/receive/receive'
        })
         break;
      case 1:
        console.log("bbb")
         break;
      case 2:
         
         break;
      case 3:
         
         break;
      case 4:
            
          break;
      default:
    }
  },
  
  clickConsume(e){//耗材管理
    console.log(e)
    var index = e.currentTarget.dataset.index;
    switch(index) {
      case 0:
         console.log("111")
         break;
      case 1:
        console.log("222")
         break;
      case 2:
         
         break;
      default:
    }
  },

  getPhoneNumber(res){//通过手机号登录
    console.log(res)
    if(res.detail.errMsg == "getPhoneNumber:ok"){
      this.getUserPhone(res.detail);
    }
  },
  
  getUserPhone(e){//登录成功展示对应的数据
    var session_key = wx.getStorageSync("session_key");
    var params = {
      encryptedData:e.encryptedData,
      iv:e.iv,
      session_key:session_key
    }
    console.log(params)
    app.wxRequest(app.globalData.httpUrl+"/Mini/Regist",params,(res)=>{
      console.log(res)
      if(res.code==1){
        if(this.data.userData.UserInfo.length>0){
          if(res.msg==this.data.userData.UserInfo[0].Phone){
            if(this.data.userData.Company.length>0){
              var companyArr = [];
              for(var i=0;i<this.data.userData.Company.length;i++){
                companyArr.push(this.data.userData.Company[i].Company);
              }
              this.setData({
                companyArrAll:this.data.userData.Company,
                companyArr:companyArr,
                register:1,
                propertyState:true
              })
              wx.setStorageSync('CompanyID', this.data.companyArrAll[this.data.pickerIndex].CompanyID)
              var CompanyID = wx.getStorageSync("CompanyID")
              this.getCompanyAsset(CompanyID);
            }else{
              this.setData({
                registerPhone:res.msg,
                register:2,
              })
            }
          }else{
            this.setData({
              registerPhone:res.msg,
              register:2,
            })
          }
        }else{
          this.setData({
            registerPhone:res.msg,
            register:2,
          })
        }
      }else{
        wx.showToast({
          title: ''+res.msg,
          icon:"none",
          duration:2000
        })
      }
    },this,"POST"); 
  },
  getCompanyAsset(id){//获取公司所对应资产(我的资产)
    console.log(id)
    app.wxRequest(app.globalData.httpUrl+"/Mini_Asset/Index",{},(res)=>{
      console.log(res)
      if(res.code==1){
        this.setData({
          myPropertyArr:res.Count,
        })
      }
    },this,"POST",{CompanyID:id})
  },
  bindPickerChange(e){//改变picker
    console.log(e)
    this.setData({
      pickerIndex:e.detail.value
    })
    wx.setStorageSync('CompanyID', this.data.companyArrAll[this.data.pickerIndex].CompanyID)
    var CompanyID = wx.getStorageSync("CompanyID")
    this.getCompanyAsset(CompanyID);
  },
  quitFn(){//退出登录
    app.wxRequest(app.globalData.httpUrl+"/Mini/Logout",{},(res)=>{
      console.log(res)
      if(res.code==1){
        this.setData({
          register:0,
        })
      }else{
        wx.showToast({
          title: ''+res.msg,
          icon:"none",
          duration:2000
        })
      }
    },this,"POST");
  },
  skipAsset(e){
    var index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/myAssetList/myAssetList?index='+index
    })
  },
})
