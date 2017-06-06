//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  setJoke:function (id){
    var val = wx.getStorageSync(id);
    if (val){
      return 1;
    }
    wx.setStorageSync(id,1)
    return 0;
  },
  getUserInfo:function(cb,failcb){
    var that = this

    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      
      wx.login({
        success: function (res) {
          var code = res.code
            // 用户接受
            wx.getUserInfo({
              success: function (res) {
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
                wx.request({
                  url: 'https://jsjoke.net/api/weapplogin',
                  data:{
                    code:code,
                    iv:res.iv,
                    encryptedData:encodeURIComponent(res.encryptedData),
                  },
                  success: function(res){
                    var setcookies = res.data['set-cookie']
                    console.log(setcookies[0].split(';')[0].split('ssion=')[1])
                    console.log(setcookies[1].split(';')[0].split('ssion.sig=')[1])
                    that.globalData.session=setcookies[0].split(';')[0].split('ssion=')[1]
                    that.globalData.sessionsig = setcookies[1].split(';')[0].split('ssion.sig=')[1]
                  
                    }
                }) //wx.request
              }, // getUserInfo--->success  
              fail: function (res) {
                // 用户拒绝
                typeof failcb == "function" && failcb()
              }
            }) //wx.getUserInfo
           
        }// login--->success  
      }) //login 
    } //if ...else
  },
  getUserLogin: function (){
    return this.globalData.session;
  },
  globalData:{
    session:'',
    sessionsig:'',
    userInfo:null
  }
})