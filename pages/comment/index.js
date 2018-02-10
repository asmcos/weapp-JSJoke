//index.js
//获取应用实例
var wxParse = require('../../wxParse/wxParse')
var WXRequest = require('../../utils/util').WXRequest
var app = getApp()
Page({
  data: {

    jokes:[],
    comments:[],
    inputval:"",
    contents:{},
    id:null,
    video:0,
    userInfo: {}
  },
  onShareAppMessage: function () {
    var that = this

    return {
      title: '我收集的笑话，这个可以笑一年',
      path: '/pages/comment/index?id='+that.data.id,
      success: function(res) {
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
 
  goHome:function (e){
    console.log('goHome')
    wx.switchTab({
      url: '../index/index'
    })
  },
  bindFormSubmit: function(e){
    var id = this.data.jokes[0]._id
    var content = e.detail.value.content
    
    if (!content){
        wx.showLoading({
          title:"请填写内容",
          icon:'success',
          duration:1000
        })
        return ;
    }
    wx.showLoading({
          title:"评论已经发布",
          icon:'success',
          duration:1000
        })
    var that = this
    
    WXRequest({
      url:'https://jsjoke.net/api/comments?id=' + id + '&populate=author',
      method:'post',
      data:{content:content},
      success: function (res){
        that.setData({
          inputval:''
        })
        wx.request({
          url:'https://jsjoke.net/api/comments?jokeid=' + id,
          success: function (res){
            
            that.setData({
              comments:res.data
            })
          }
        })
      }
    })
  },
  onShow: function (){
    
    this.onShareAppMessage ()
  },
  onLoad: function (option) {
    console.log('onLoad')

    var id = option.id
    var that = this
    that.data.id = id
    //调用应用实例的方法获取全局数据

    app.getUserInfo(
      function(userInfo){ //success
      //更新数据
        that.setData({
          userInfo:userInfo
        })
      },
      function(){ //fail
       
          wx.showModal({
            title:'集思笑话',
            content:'您可能未授权,无法评论',
            success: function(res){
              
            }
          })
        
    }) // getUserInfo

    

    wx.request({
      url:'https://jsjoke.net/api/jokes/' + id,
      success: function (res){
        var data = [res.data]
        for (let i=0 ; i<data.length; i++){
          if (!data[i].author[0].avatar){
            data[i].author[0].avatar='https://jsjoke.net/static/default-img.png'
          } else if (data[i].author[0].avatar.slice(0,4) != 'http') {
               data[i].author[0].avatar = 'https://jsjoke.net' + data[i].author[0].avatar
          }
          wxParse.wxParse('reply' + i,'html',data[i].content,that);
          if (i === data.length - 1 ){
            wxParse.wxParseTemArray('replyTemArray','reply',data.length,that) 
          }
        }
        that.setData({
          jokes:data,
        })

        wx.request({
          url:'https://jsjoke.net/api/comments?jokeid=' + id,
          success: function (res){
            that.setData({
              comments:res.data
            })
          }
        })
      }
    })

  }
})
