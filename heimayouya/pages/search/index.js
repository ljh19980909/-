import { request } from '../../request/index';
// 防抖  定时器
Page({
    data: { goods: [], isFocus: false, inpValue: '' },
    TimeId: -1,
    handleInput(e) {
        const { value } = e.detail;
        if (!value.trim()) {
            this.setData({
                goods: [],
                isFocus: false,
            });
            return;
        }
        this.setData({
            isFocus: true,
        });
        // 防抖
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.qSearch(value);
        }, 1000);
    },
    async qSearch(query) {
        const res = await request({ url: '/goods/search', data: { query } });
        console.log(res);
        this.setData({ goods: res.goods });
    },
    // 取消
    handleCancel() {
        this.setData({
            goods: [],
            inpValue: '',
            isFocus: false,
        });
    },
});
