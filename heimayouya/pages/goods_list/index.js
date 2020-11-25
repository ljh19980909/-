// pages/goods_list/index.js
import { request } from '../../request/index';
Page({
    /**
     * 页面的初始数据
     */
    // 接口要的参数
    QueryParams: {
        query: '',
        cid: '',
        pagenum: 1,
        pagesize: 10,
    },
    data: {
        tabs: [
            {
                id: 0,
                value: '综合',
                isActive: true,
            },
            {
                id: 1,
                value: '销量',
                isActive: false,
            },
            {
                id: 2,
                value: '价格',
                isActive: false,
            },
        ],
        GoodList: [],
    },
    totalPages: 1,
    // 标题点击事件
    handleTabsItemChange(e) {
        // 1.获取被点击的标题索引
        const { index } = e.detail;
        // 2.修改原数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => (i === index ? (v.isActive = true) : (v.isActive = false)));
        // 3.赋值到data中
        this.setData({
            tabs,
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.QueryParams.cid = options.cid || '';
        this.QueryParams.query = options.query || '';
        this.getGoodList();
    },
    // 获取商品列表数据
    async getGoodList() {
        const res = await request({ url: '/goods/search', data: this.QueryParams });
        // 获取总条数
        const total = res.total;
        // 计算总页数
        this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
        this.setData({
            // 拼接数组
            GoodList: [...this.data.GoodList, ...res.goods],
        });
        // 关闭下拉刷新窗口 如果没有调用下拉刷新的窗口 直接关闭也不会报错
        wx.stopPullDownRefresh();
    },
    onPullDownRefresh: function () {
        console.log('object');
        // 1.重置数组
        this.setData({
            GoodList: [],
        });
        // 2.重置页码
        this.QueryParams.pagenum = 1;
        // 3.重新发送请求
        this.getGoodList();
    },
    onReachBottom: function () {
        // 判断是否有下一页数据
        if (this.QueryParams.pagenum >= this.totalPages) {
            // 没有下一页数据
            wx.showToast({
                title: '没有下一页数据',
            });
        } else {
            // 有下一页数据
            this.QueryParams.pagenum++;
            this.getGoodList();
        }
    },
});
