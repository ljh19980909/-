//Page Object
import { request } from '../../request/index';
Page({
    data: {
        swiperList: [],
        catesList: [],
        floorList: [],
    },
    //options(Object)
    onLoad: function (options) {
        this.getSwiperList();
        this.getCatesList();
        this.getFloorsList();
    },
    // 获取轮播图数据
    getSwiperList() {
        request({ url: '/home/swiperdata' })
            .then(result => {
                console.log(result);
                this.setData({
                    swiperList: result,
                });
            })
            .catch(err => {
                console.log(err);
            });
    },
    // 获取导航栏数组
    getCatesList() {
        request({ url: '/home/catitems' })
            .then(result => {
                this.setData({
                    catesList: result,
                });
            })
            // floor_title
            // product_list
            .catch(err => {
                console.log(err);
            });
    },
    // 获取楼层数据
    getFloorsList() {
        request({ url: '/home/floordata' })
            .then(result => {
                console.log(result);
                this.setData({
                    floorList: result,
                });
            })
            .catch(err => {
                console.log(err);
            });
    },
    handleNavigator(e) {
        const { index } = e.currentTarget.dataset;
        let url = index.replace('/pages/goods_list', '/pages/goods_list/index');
        wx.navigateTo({
            url: url,
        });
        // /pages/goods_list?query=爆款
    },
});
