import { request } from '../../request/index';
import { login } from '../../utils/asyncWx.js';
Page({
    async handleGetUserInfo(e) {
        try {
            // 获取用户信息
            const { encryptedData, rawData, signature, iv } = e.detail;
            //用户登录 获取code
            const { code } = await login();
            const loginParams = { encryptedData, rawData, iv, signature, code };
            // // 发送请求 获取token
            // const res = await request({ url: '/users/wxlogin', data: loginParams, method: 'post' });
            const token =
                'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';
            wx.setStorageSync('token', token);
            wx.navigateBack({
                delta: 1,
            });
        } catch (error) {
            console.log(error);
        }
    },
});
