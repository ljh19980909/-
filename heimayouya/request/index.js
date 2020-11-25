let times = 0;
export const request = params => {
    let header = { ...params.header };
    if (params.url.includes('/my/')) {
        header['Authorization'] = wx.getStorageSync('token');
    }
    times++;
    // 显示加载中 效果
    wx.showLoading({
        title: '加载中',
        mask: true,
    });
    // 定义公共的url
    const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: result => {
                resolve(result.data.message);
            },
            fail: err => {
                reject(err);
            },
            complete: function () {
                times--;
                if (times === 0) {
                    // 关闭正在加载的图标
                    wx.hideLoading();
                }
            },
        });
    });
};
