// pages/category/index.js
import { request } from '../../request/index';
Page({
    /**
     * 页面的初始数据
     */
    data: {
        // 左侧菜单数据
        leftMenuList: [],
        // 右侧商品数据
        rightContent: [],
        // 被点击的左侧的菜单
        currentIndex: 0,
        //每次滚动距离清零
        scrollTop: 0,
    },
    Cates: [],

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 先判断一下本地存储中有没有旧的数据
        // { time:Date.now(),data:[...]}
        // 没有旧数据 直接发送新的请求
        // 有旧的数据 同时 旧的数据也没有过期 就使用本地存储中的数据即可

        // 1.获取本地存储中的数据
        const Cates = wx.getStorageSync('cates');
        // 2.判断
        if (!Cates) {
            // 不存在 发送请求获取数据
            this.getCategoryList(this.data.currentIndex);
        } else {
            // 有旧的数据 定义过期时间 10s改成5min
            if (Date.now() - Cates.time > 1000 * 10) {
                this.getCategoryList(this.data.currentIndex);
            } else {
                // 可以使用旧的数据
                this.Cates = Cates.data;
                // 左侧菜单数据
                let leftMenuList = this.Cates.map(v => v.cat_name);
                // 右侧内容数据
                let rightContent = this.Cates[i].children;
                this.setData({
                    leftMenuList,
                    rightContent,
                });
            }
        }
    },
    // 获取分类数据
    async getCategoryList(i) {
        const res = await request({ url: '/categories' });
        this.Cates = res;
        // 把接口的数据存入到本地存储中
        wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
        // 左侧菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name);
        // 右侧内容数据
        let rightContent = this.Cates[i].children;
        this.setData({
            leftMenuList,
            rightContent,
        });
    },
    // 获取下标
    handleItemTap(e) {
        this.setData(
            {
                currentIndex: e.currentTarget.dataset.index,
                scrollTop: 0,
            },
            () => {
                this.getCategoryList(this.data.currentIndex);
            }
        );
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {},
});
