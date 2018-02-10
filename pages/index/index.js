//index.js
//获取应用实例
var wxParse = require('../../wxParse/wxParse')
var WXRequest = require('../../utils/util').WXRequest
var formatTime = require('../../utils/util').formatTime
var app = getApp()
Page({
  data: {
    showloading: 1,
    count:20,
    jokes:{},
    contents:{},
    userInfo: {},
    oldvideoContext:null
  },
  onShareAppMessage: function () {
    return {
      title: '我收集的笑话，这个可以笑一年',
      path: '/pages/index/index',
      success: function(res) {
        // console.log(res)
        if (res.shareTickets){
          // 如果用户从群里进来
          // 带有群信息
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success: function (res){
              console.log(res)
            }
          })
        } // res.shareTickets
        WXRequest({
          url:'https://jsjoke.net/api/share',
          method:'post',
        })
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  onShow: function (){
    var that = this
    
    that.data.count=20
    //调用应用实例的方法获取全局数据
    wx.request({
      url:'https://jsjoke.net/api/jokes?video=2&limit=' + 20,
      success: function (res){
        for (let i=0 ; i<res.data.length; i++){
          if (!res.data[i].author[0].avatar){
            res.data[i].author[0].avatar='https://jsjoke.net/static/default-img.png'
          } else if (res.data[i].author[0].avatar.slice(0,4) != 'http') {
               res.data[i].author[0].avatar = 'https://jsjoke.net' + res.data[i].author[0].avatar
          }
          
          // res.data[i].createdate = Date(res.data[i].createdate)
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
   // 获取内容成功
  },
  onPullDownRefresh: function (){
    // can refresh ?
       var that = this
        wx.showLoading({
          title:"加载最新",
          icon:'success',
          duration:3000
        })
    //调用应用实例的方法获取全局数据
    that.data.count = 20
    wx.request({
      url:'https://jsjoke.net/api/jokes?video=2&limit=' + 20,
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
    
  },
  onReachBottom: function (){
    console.log('onReachBottom')
    this.lower()
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

  getusefromserver: function(e){
    wx.switchTab({
      url: '/pages/my/my',
      success: function(res){
        // success
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
  },
  onReady: function () {

  },
  playvideo: function (e) {

    var id = e.currentTarget.id
    var videoContext = wx.createVideoContext(id)

    if (this.data.oldvideoContext && this.data.oldvideoContext.domId != videoContext.domId) {

      this.data.oldvideoContext.pause()
    }
    this.data.oldvideoContext = videoContext
  },
  lower: function() {
   // console.log(e)
    
    var that = this
    var old = that.data.count
    
    wx.showLoading({
      title:"加载更多",
      icon:'success',
      duration:3000
    })

    that.setData({
      showloading: 0,
    })
    //调用应用实例的方法获取全局数据
    that.data.count += 20
    wx.request({
      url:'https://jsjoke.net/api/jokes?video=2&limit=' + 20 + '&skip=' + old,
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
          showloading: 1,
        })
        
        
      }
    })

  },
  onLoad: function () {
    console.log('onLoad')
    this.wxParseInit()
    wx.showShareMenu({
      withShareTicket:true
    })
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(
      function(userInfo){ //success
      //更新数据
        that.setData({
          userInfo:userInfo
        })
    }) // getUserInfo
    
  },
  wxParseInit:function (){
    wxParse.emojisInit('[]','/wxParse/emojis/',{
      '笑脸':'00.gif',
      '微笑':'00.gif',
      '/cp':'00.gif',
      '撇嘴':'01.gif',
      '捂脸':'01.gif',
      '色':'02.gif',
      '发呆':'03.gif',
      '得意':'04.gif',
      '流泪':'05.gif',
      '害羞':'06.gif',
      '闭嘴':'07.gif',
      '睡':'08.gif',
      '大哭':'09.gif',
      '尴尬':'10.gif',
      '发怒':'11.gif',
      '调皮':'12.gif',
      '呲牙':'13.gif',
      '惊讶':'14.gif',
      '难过':'15.gif',
      '酷':'16.gif',
      '冷汗':'17.gif',
      '抓狂':'18.gif',
      '吐':'19.gif',
      '偷笑':'20.gif',
      '愉快':'21.gif',
      '白眼':'22.gif',
      '傲慢':'23.gif',
      '饥饿':'24.gif',
      '困':'25.gif',
      '惊恐':'26.gif',
      '流汗':'27.gif',
      '憨笑':'28.gif',
      '悠闲':'29.gif',
      '奋斗':'30.gif',
    })
  }
})
