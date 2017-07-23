var wxParse = require('../../wxParse/wxParse')
var WXRequest = require('../../utils/util').WXRequest
var app = getApp()
Page({
  data: {
    videourl: null,
    content: '',
    userInfo: {}
  },
  bindFormSubmit: function (e) {


    var content = e.detail.value.content

    var videourl = this.data.videourl
    var reg = new RegExp("\n", "g")
    content = content.replace(reg, '</p>')

    if (!videourl) {
      wx.showLoading({
        title: "请填上传10M以内视频",
        icon: 'success',
        duration: 1000
      })
      return;
    }


    wx.showToast({
      title: '正在发送，请稍后',
      icon: 'success',
      duration: 2000
    })

    WXRequest({
      url: 'https://jsjoke.net/api/jokes',
      method: 'POST',
      data: { content: content,videourl:videourl },
      success: function (res) {
        //console.log(res)
        wx.navigateTo({
          url: '../video/play'
        })
      }
    })
  },
  chooseVideo: function () {
    var that = this
    console.log("chooseVideo")
    if (this.videourl){
      wx.showLoading({
        title: "您已经上传了视频，请勿再次上传",
        icon: 'success',
        duration: 1000
      })
      return;
    }
    wx.chooseVideo({
      success: function (res) { 
        wx.showLoading({
          title: "视频上传中，请稍后",
        })
        wx.uploadFile({
          url: 'https://jsjoke.net/uploader/uploadimage?responseType=json&video=1',
          filePath: res.tempFilePath,
          name: 'upload',
          formData: {
          },
          success: function (res) {
            wx.hideLoading()
            var data = JSON.parse(res.data)
            that.setData({
              videourl: data['url']
            })

          } //uploadfile success
        })
      } //choose image success
    })
  },
  onLoad: function () {
    var that = this

    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })

    if (app.getUserLogin() === '') {
      wx.showModal({
        title: '集思笑话',
        content: '您可能授权,发不了笑话',
        success: function (res) {
          wx.switchTab({
            url: '../index/index'
          })
        }
      })
    } // if app.getUserLogin
  }
})
