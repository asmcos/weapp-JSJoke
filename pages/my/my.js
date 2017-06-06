var wxParse = require('../../wxParse/wxParse')
var WXRequest = require('../../utils/util').WXRequest
var app = getApp()
Page({
  data: {
    userInfo: {},
    count: 20,
    jokes:[]
  },
  onPullDownRefresh: function (){
    var that = this
    that.data.count = 20
    wx.showLoading({
          title:"加载最新",
          icon:'success',
          duration:3000
        })
    WXRequest({
          url:'https://jsjoke.net/api/my/jokes?limit=' + that.data.count,
          success: function (res){ 
            for (let i=0 ; i<res.data.length; i++){
              if (!res.data[i].author[0].avatar){
                res.data[i].author[0].avatar='https://jsjoke.net/static/default-img.png'
              } else if (res.data[i].author[0].avatar.slice(0,4) != 'http') {
                  res.data[i].author[0].avatar = 'https://jsjoke.net' + res.data[i].author[0].avatar
              }
              wxParse.wxParse('reply' + i,'html',res.data[i].content,that);
              if (i === res.data.length - 1 ){
                wxParse.wxParseTemArray('replyTemArray','reply',res.data.length,that) 
              }
          }

          that.setData({
            jokes:res.data,

          })
        
        } //success
      }) //WXRequest
  },
  del: function (e){
    var that = this
    var id = e.currentTarget.dataset.id
     wx.showLoading({
      title:"正在删除",
      icon:'success',
      duration:3000
    })
    WXRequest({
      url:'https://jsjoke.net/api/jokes/' + id,
      method:'delete',
      success: function (res){
        WXRequest({
          url:'https://jsjoke.net/api/my/jokes',
          success: function (res){
            for (let i=0 ; i<res.data.length; i++){
              if (!res.data[i].author[0].avatar){
                res.data[i].author[0].avatar='https://jsjoke.net/static/default-img.png'
              } else if (res.data[i].author[0].avatar.slice(0,4) != 'http') {
                  res.data[i].author[0].avatar = 'https://jsjoke.net' + res.data[i].author[0].avatar
              }
              wxParse.wxParse('reply' + i,'html',res.data[i].content,that);
              if (i === res.data.length - 1 ){
                wxParse.wxParseTemArray('replyTemArray','reply',res.data.length,that) 
              }
          }

          that.setData({
            jokes:res.data,

          })
        
        } //success
      }) //WXRequest
     } //success
    }) //WXRequest
  },
  bindcomment: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    wx.navigateTo({
      url:'../comment/index?id=' + id
    })
  },
  bindjoke: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    if (app.setJoke(id + 'joke')){
      return ;
    }
    wx.request({
      url:'https://jsjoke.net/api/jokes/' + id + '?joke=1',
      success: function (res){
        //console.log(res.data)
        that.data.jokes[index].joke = res.data.joke
        that.setData({
          jokes:that.data.jokes
        })
      }
    })
  },
  
  bindunjoke: function(e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    if (app.setJoke(id + 'unjoke')){
      return ;
    }
    wx.request({
      url:'https://jsjoke.net/api/jokes/' + id + '?unjoke=1',
      success: function (res){
        that.data.jokes[index].unjoke = res.data.unjoke
        that.setData({
          jokes:that.data.jokes
        })
        
      }
    })
  },
  onReachBottom: function (){
    
    wx.showLoading({
          title:"加载最新",
          icon:'success',
          duration:3000
        })
    var that = this
    that.data.count += 20
    WXRequest({
      url:'https://jsjoke.net/api/my/jokes?limit=' + that.data.count,
      success: function (res){
        for (let i=0 ; i< res.data.length; i++){
          if (!res.data[i].author[0].avatar){
            res.data[i].author[0].avatar='https://jsjoke.net/static/default-img.png'
          } else if (res.data[i].author[0].avatar.slice(0,4) != 'http') {
               res.data[i].author[0].avatar = 'https://jsjoke.net' + res.data[i].author[0].avatar
          }
          wxParse.wxParse('reply' + i,'html',res.data[i].content,that);
          if (i === res.data.length - 1  ){
            wxParse.wxParseTemArray('replyTemArray','reply',res.data.length,that) 
          }
        }

        that.setData({
          jokes:res.data,
        })
        
      }
    })
  },
  onLoad: function (){
    var that = this
    app.getUserInfo(
      function(userInfo){
      //更新数据
        that.setData({
          userInfo:userInfo
        })
     },
      function(){ //fail
          wx.showModal({
            title:'集思笑话',
            content:'您可能未授权,无法发笑话',
            success: function(res){
            }
          })
      })
    WXRequest({
      url:'https://jsjoke.net/api/my/jokes?limit=' + that.data.count,
      success: function (res){
        for (let i=0 ; i< res.data.length; i++){
          if (!res.data[i].author[0].avatar){
            res.data[i].author[0].avatar='https://jsjoke.net/static/default-img.png'
          } else if (res.data[i].author[0].avatar.slice(0,4) != 'http') {
               res.data[i].author[0].avatar = 'https://jsjoke.net' + res.data[i].author[0].avatar
          }
          wxParse.wxParse('reply' + i,'html',res.data[i].content,that);
          if (i === res.data.length - 1  ){
            wxParse.wxParseTemArray('replyTemArray','reply',res.data.length,that) 
          }
        }

        that.setData({
          jokes:res.data,
        })
        
      }
    })
  }
})