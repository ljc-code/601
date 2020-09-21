//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var openid = wx.getStorageSync('openid') || "";
    // if(!openid){
      
    // }else{
    //   this.globalData.openId = openid
    // };
  },
  onShow(){
    // 登录
    wx.login({
      success: res => {
        console.log(res)
        if(res.code){
          this.wxRequest(this.globalData.httpUrl+"/Mini/Login",{code: res.code},(res)=>{
            console.log(res)
            if(res.code==1){
              wx.setStorageSync('openid', res.openid);
              wx.setStorageSync('session_key', res.session_key);
              wx.setStorageSync('userStatus', res.Status);//用户状态
              this.globalData.openId = res.openid;
              if(this.callBackFn){
                this.callBackFn();
              }
            }else{
              wx.showToast({
                title: ''+res.msg,
                icon:"none",
                duration:2000
              })
            }
          },this,"POST")
        } else {
          console.log("登陆失败" + res.msg)
        }
      }
    })
  },
  globalData: {
    openId:"",
    userInfo: null,
    httpUrl:"https://mini.ezc365.cn",
    imgUrl:"http://asset.ymade.cn/Headimg/s/",
    checkDataArr:[],//选中添加资产的数据
  },

  //接口封装
  wxRequest: function (url, params, callback, thisArg, methods, object) {
    var httpUrl = url;
    var str = "";
    var count = 0;
    for (let key in params) {
      if (count) {
        str += "&" + key + "=" + params[key];
      } else {
        str += key + "=" + params[key];
      }
      count++;
    }
    if (str) {
      httpUrl += "?" + str;
    }
    if (!methods) {
      methods = "GET";
    }
    if (methods == "POST") {
      var header = {
        "content-type": "application/x-www-form-urlencoded",
        "openid": this.globalData.openId
      }
      if(object){
        for(let key in object){
          header[key] = object[key]
        }
      }
      wx.request({
        url: url,
        data: params,
        method: methods,
        header:header,
        success: function (re) {
          if (callback && thisArg) {
            callback.call(thisArg, re.data);
          }
        }
      })
    } else {
      wx.request({
        url: httpUrl,
        method: methods,
        header: {
          "openid": this.globalData.openId
        },
        success: function (re) {
          if (callback && thisArg) {
            callback.call(thisArg, re.data);
          }
        }
      })
    }
  }
})