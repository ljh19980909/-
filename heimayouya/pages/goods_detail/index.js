import { request } from '../../request/index';
Page({
    /**
     * 页面的初始数据
     */
    data: { goodsObj: {}, isCollect: false },
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        let pages = getCurrentPages();
        let currentPages = pages[pages.length - 1];
        let options = currentPages.options;
        const { goods_id } = options;
        this.getGoodsDetail(goods_id);
    },
    // 获取数据
    async getGoodsDetail(goods_id) {
        const goodsObj = await request({ url: '/goods/detail', data: { goods_id } });
        this.GoodsInfo = goodsObj;
        // 1.获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync('collect') || [];
        // 2.判断当前商品是否被收藏
        let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
        this.setData({
            goodsObj: {
                pics: goodsObj.pics,
                goods_price: goodsObj.goods_price,
                goods_name: goodsObj.goods_name,
                goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
            },
            isCollect,
        });
    },
    // 点击轮播图 预览大图
    handlePreviewImage(e) {
        console.log(e);
        const current = e.currentTarget.dataset.url;
        const urls = this.GoodsInfo.pics.map(v => v.pics_mid);
        wx.previewImage({
            current,
            urls,
        });
    },
    // 点击加入购物车
    handleCartAdd() {
        // 1.获取缓存中的购物车 数组
        let cart = wx.getStorageSync('cart') || [];
        // 2.判断 商品对象是否存在于购物车数组中
        let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        if (index !== -1) {
            // 存在购物车数据 执行 num++
            cart[index].num++;
        } else {
            // 不存在 第一次添加
            this.GoodsInfo.num = 1;
            this.GoodsInfo.checked = true;
            cart.push(this.GoodsInfo);
        }
        // 购物车重新添加回缓存中
        wx.setStorageSync('cart', cart);
        // 展示弹窗
        wx.showToast({
            title: '加入成功',
            icon: 'success',
            // true防止用户 手抖 疯狂点击按钮
            mask: true,
        });
    },
    // 收藏
    handleCollect() {
        let isCollect = false;
        // 1.获取缓存中的商品收藏的数组
        let collect = wx.getStorageSync('collect') || [];
        // 2.判断该商品是否被收藏
        let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
        // 3.当index!=-1表示已收藏,需要删除
        if (index !== -1) {
            collect.splice(index, 1);
            isCollect = false;
            wx.showToast({
                title: '取消成功',
                icon: 'success',
                mask: true,
            });
        } else {
            collect.push(this.GoodsInfo);
            isCollect = true;
            wx.showToast({
                title: '收藏成功',
                icon: 'success',
                mask: true,
            });
        }
        // 4.把数组存入到缓存中
        wx.setStorageSync('collect', collect);
        // 5.修改data中的属性 isCollect
        this.setData({
            isCollect,
        });
    },
});
