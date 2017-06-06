// pages/sort/user.js
var WXRequest = require('../../utils/util').WXRequest

Page({
  data:{
    userlist:{}
    },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this
     WXRequest({
      url:'https://jsjoke.net/api/userlevel',
      success: function (res){

        for (let i=0 ; i<res.data.length; i++){
          if (!res.data[i].avatar){
            res.data[i].avatar='https://jsjoke.net/static/default-img.png'
          } else if (res.data[i].avatar.slice(0,4) != 'http') {
               res.data[i].avatar = 'https://jsjoke.net' + res.data[i].avatar
          }
        }
        //res.data
        that.setData({
          userlist:res.data,
        })
      }
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})