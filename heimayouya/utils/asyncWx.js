// promise形式 getSetting
export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: result => {
                resolve(result);
            },
            fail: err => {
                console.log(err);
                reject(err);
            },
        });
    });
};
// promise形式 chooseAddress
export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        wx.chooseAddress({
            success: result => {
                resolve(result);
            },
            fail: err => {
                console.log(err);
                reject(err);
            },
        });
    });
};
// promise形式 openSetting
export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
            success: result => {
                resolve(result);
            },
            fail: err => {
                reject(err);
            },
        });
    });
};

// promise形式 login
export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            success: result => {
                resolve(result);
            },
            fail: err => {
                reject(err);
            },
        });
    });
};
// promise形式 小程序的微信支付
export const requestPayment = pay => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: result => {
                resolve(result);
            },
            fail: err => {
                reject(err);
            },
        });
    });
};
