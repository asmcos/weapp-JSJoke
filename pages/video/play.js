// pages/video/play.js
var wxParse = require('../../wxParse/wxParse')
var app = getApp()
Page({
  data:{
    url:"",
    backimage:"/images/jsjokeqrcode.jpg",
    jokes:[],
    count:20
  },
  onReachBottom: function (){
    
  },
  bindcomment: function (e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    wx.navigateTo({
      url: '../comment/index?video=1&id=' + id
    })
  },
  bindjoke: function (e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this

    if (app.setJoke(id + 'joke')) {
      return;
    }

    wx.request({
      url: 'https://jsjoke.net/api/jokes/' + id + '?joke=1',
      success: function (res) {
        //console.log(res.data)
        that.data.jokes[index].joke = res.data.joke
        that.setData({
          jokes: that.data.jokes
        })
      }
    })
  },
  bindunjoke: function (e) {
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    var that = this
    if (app.setJoke(id + 'unjoke')) {
      return;
    }
    wx.request({
      url: 'https://jsjoke.net/api/jokes/' + id + '?unjoke=1',
      success: function (res) {
        that.data.jokes[index].unjoke = res.data.unjoke
        that.setData({
          jokes: that.data.jokes
        })
      }
    })
  },
  goHome: function (e) {
    console.log('goHome')
    wx.switchTab({
      url: '../index/index'
    })
  },
  bindFormSubmit: function (e) {
    var id = this.data.jokes[0]._id
    var content = e.detail.value.content

    if (!content) {
      wx.showLoading({
        title: "请填写内容",
        icon: 'success',
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: "评论已经发布",
      icon: 'success',
      duration: 1000
    })
    var that = this

    WXRequest({
      url: 'https://jsjoke.net/api/comments?id=' + id + '&populate=author',
      method: 'post',
      data: { content: content },
      success: function (res) {
        that.setData({
          inputval: ''
        })
        wx.request({
          url: 'https://jsjoke.net/api/comments?jokeid=' + id,
          success: function (res) {

            that.setData({
              comments: res.data
            })
          }
        })
      }
    })
  },
  onLoad:function(options){
    
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    var that = this
    
    that.data.count=20
    //调用应用实例的方法获取全局数据
    wx.request({
      url:'https://jsjoke.net/api/jokes?video=1&limit=' + 20,
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
      }
    })
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})