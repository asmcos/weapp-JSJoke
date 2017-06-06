Page({
    data:{
       
        list:[
            /*{
                list_tool:[
                    {
                        img:"/images/friend_r.png",
                        name:"笑话圈"
                        
                    }
                ]
            },*/

            {
                list_tool:[
                    {
                        img:"/images/sort.png",
                        name:"积分排名",
                        url:'/pages/sort/user'
                    },
                    {
                        img:"/images/hotjoke.png",
                        name:"视频笑话",
                        url:'/pages/video/play'
                    }
                ]
            },
        ]
    },
    goPage:function(e){
        wx.navigateTo({
            url: e.currentTarget.dataset.url
        })
    }
})
