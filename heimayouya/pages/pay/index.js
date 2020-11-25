import { getSetting, chooseAddress, openSetting, requestPayment } from '../../utils/asyncWx.js';
import { request } from '../../request/index';
const { $Message } = require('../../dist/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: { address: {}, cart: [], allPrice: 0, allNum: 0 },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 获取缓存中收货地址信息
        let address = wx.getStorageSync('resChoose');
        // 获取缓存中购物车数据
        let cart = wx.getStorageSync('cart') || [];
        cart = cart.filter(v => v.checked);
        address
            ? (address.all =
                  address.provinceName + address.cityName + address.countyName + address.detailInfo)
            : {};
        this.setData({
            address,
        });
        this.setCart(cart);
    },
    // 设置购物车状态同时,重新计算,底部工具栏的数据
    setCart(cart) {
        // 计算总价
        let allPrice = 0,
            allNum = 0;
        cart.forEach(v => {
            allPrice += v.goods_price * v.num;
            allNum += v.num;
        });
        // 5.购物车数据重新设置data和缓存
        this.setData({
            cart,
            allNum,
            allPrice,
        });
        wx.setStorageSync('cart', cart);
    },
    // 点击 支付
    async handleOrderPay() {
        try {
            const token = wx.getStorageSync('token');
            if (!token) {
                wx.navigateTo({
                    url: '/pages/auth/index',
                });
                return;
            }
            const { allPrice, cart } = this.data;
            let order_price = allPrice,
                consignee_addr = this.data.address.all;
            let goods = [];
            cart.forEach(v =>
                goods.push({
                    goods_id: v.goods_id,
                    goods_number: v.num,
                    goods_price: v.goods_price,
                })
            );
            const orderParams = { order_price, consignee_addr, goods };
            // 4 准备发送请求 创建订单 获取订单编号
            const { order_number } = await request({
                url: '/my/orders/create',
                data: orderParams,
                method: 'post',
            });
            // 5 发起 支付接口
            const { pay } = await request({
                url: '/my/orders/req_unifiedorder',
                data: { order_number },
                method: 'post',
            });
            // 6 发起微信支付
            await requestPayment(pay);
            // 7 查询后台 订单状态
            const result = await request({
                url: '/my/orders/chkOrder',
                method: 'POST',
                data: { order_number },
            });
            await wx.showToast({
                title: '支付成功',
                mask: true,
            });
            // 8 手动删除缓存中已经支付了的商品
            let newCart = wx.getStorageSync('cart');
            newCart = newCart.filter(v => !v.checked);
            wx.setStorageSync('cart', newCart);
            // 9 支付成功了 跳转到订单页面
            wx.navigateTo({
                url: '/pages/order/index',
            });
        } catch (error) {
            await wx.showToast({
                title: '支付失败',
            });
            console.log(error);
        }
    },
});
