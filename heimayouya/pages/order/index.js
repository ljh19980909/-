import { request } from '../../request/index';

Page({
    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
            {
                id: 0,
                value: '全部',
                isActive: true,
            },
            {
                id: 1,
                value: '待付款',
                isActive: false,
            },
            {
                id: 2,
                value: '待发货',
                isActive: false,
            },
            {
                id: 3,
                value: '退款/退货',
                isActive: false,
            },
        ],
        orders: [],
    },
    onShow(options) {
        const token = wx.getStorageSync('token');
        if (!token) {
            wx.navigateTo({
                url: '/pages/auth/index',
            });
            return;
        }
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        const { type } = currentPage.options;
        this.changeTitleByIndex(type - 1);
        this.getOrders(type);
    },
    // 获取订单列表的方法
    async getOrders(type) {
        const res = await request({ url: '/my/orders/all', data: { type } });
        console.log(res);
        this.setData({
            orders: res.orders.map(v => ({
                ...v,
                create_time_cn: new Date(v.create_time * 1000).toLocaleString(),
            })),
        });
    },
    handleTabsItemChange(e) {
        // 1.获取被点击的标题索引
        const { index } = e.detail;
        this.changeTitleByIndex(index);
        this.getOrders(index + 1);
    },
    // 根据标题索引来激活选中 标题数组
    changeTitleByIndex(index) {
        // 2.修改原数组
        let { tabs } = this.data;
        tabs.forEach((v, i) => (i === index ? (v.isActive = true) : (v.isActive = false)));
        // 3.赋值到data中
        this.setData({
            tabs,
        });
    },
});
