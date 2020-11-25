import { getSetting, chooseAddress, openSetting } from '../../utils/asyncWx.js';
const { $Message } = require('../../dist/base/index');
Page({
    /**
     * 页面的初始数据
     */
    data: { address: {}, cart: [], allChecked: false, allPrice: 0, allNum: 0 },
    // 点击收货地址(用户拒绝出问题)
    async handleChooseAddress() {
        try {
            const resGet = await getSetting();
            const scopeAddress = resGet.authSetting['scope.address'];
            if (scopeAddress === false) {
                await openSetting();
            }
            const resChoose = await chooseAddress();
            wx.setStorageSync('resChoose', resChoose);
        } catch (error) {
            console.log(error);
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        // 获取缓存中收货地址信息
        let address = wx.getStorageSync('resChoose');
        // 获取缓存中购物车数据
        let cart = wx.getStorageSync('cart') || [];
        address
            ? (address.all =
                  address.provinceName + address.cityName + address.countyName + address.detailInfo)
            : {};
        this.setData({
            address,
        });
        this.setCart(cart);
    },
    // 商品的选中
    handleItemChange(e) {
        // 1.获取被修改的商品id
        const { id } = e.currentTarget.dataset;
        // 2.获取购物车数组
        let { cart } = this.data;
        // 3.找到被修改的商品对象
        let index = cart.findIndex(v => v.goods_id == id);
        // 4.选中状态取反
        cart[index].checked = !cart[index].checked;
        this.setCart(cart);
    },
    // 设置购物车状态同时,重新计算,底部工具栏的数据
    setCart(cart) {
        // 判断是否全选
        let allChecked = true;
        // 计算总价
        let allPrice = 0,
            allNum = 0;
        cart.forEach(v => {
            if (v.checked) {
                allPrice += v.goods_price * v.num;
                allNum += v.num;
            } else {
                allChecked = false;
            }
        });
        allChecked = cart.length ? allChecked : false;
        // 5.购物车数据重新设置data和缓存
        this.setData({
            cart,
            allNum,
            allPrice,
            allChecked,
        });
        wx.setStorageSync('cart', cart);
    },
    // 商品全选反选
    handleItemAllChecked() {
        let { allChecked, cart } = this.data;
        allChecked = !allChecked;
        cart.forEach(v => (v.checked = allChecked));
        this.setCart(cart);
    },
    // 商品计算数量
    handleItemNumEdit(e) {
        const { id, operation } = e.currentTarget.dataset;
        let { cart } = this.data;
        let index = cart.findIndex(v => v.goods_id === id);
        if (cart[index].num === 1 && operation === -1) {
            wx.showModal({
                title: '提示',
                content: '您是否要删除此商品??',
                success: result => {
                    if (result.confirm) {
                        cart.splice(index, 1);
                        this.setCart(cart);
                    }
                },
            });
        } else {
            cart[index].num += operation;
            this.setCart(cart);
        }
    },
    // 商品结算
    handlePay() {
        const { address, allNum } = this.data;
        if (!address) {
            $Message({
                content: '您还没有选择收货地址呢',
            });
            return;
        }
        if (allNum === 0) {
            $Message({
                content: '您还没有选购商品呢',
            });
            return;
        }
        wx.navigateTo({
            url: '/pages/pay/index',
        });
    },
});
