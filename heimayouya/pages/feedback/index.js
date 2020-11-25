// pages/feedback/index.js
Page({
    data: {
        tabs: [
            {
                id: 0,
                value: '体验问题',
                isActive: true,
            },
            {
                id: 1,
                value: '商品、商家投诉',
                isActive: false,
            },
        ],
        // 被选中的图片路径 数组
        chooseImgs: [],
        // 描述
        textVal: '',
    },
    // 外网图片路径数组
    UpLoadImgs: [],
    // input问题
    handleTabsItemChange(e) {
        const { index } = e.detail;
        let { tabs } = this.data;
        tabs.forEach((v, i) => (i === index ? (v.isActive = true) : (v.isActive = false)));
        this.setData({
            tabs,
        });
    },
    // 加号 选择图片
    handleChoose() {
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: result => {
                this.setData({
                    chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths],
                });
            },
        });
    },
    // 删除图片
    handleRemoveImg(e) {
        const { index } = e.currentTarget.dataset;
        const { chooseImgs } = this.data;
        chooseImgs.splice(index, 1);
        this.setData({
            chooseImgs,
        });
    },
    handleTextInput(e) {
        const { value } = e.detail;
        this.setData({
            textVal: value,
        });
    },
    // 提交按钮
    handleFormSubmit() {
        const { chooseImgs, textVal } = this.data;
        if (!textVal.trim()) {
            wx.showToast({
                title: '输入不合法',
                icon: 'none',
                mask: true,
            });
            return;
        }
        wx.showLoading({
            title: '正在上传中',
            mask: true,
        });
        if (chooseImgs.length != 0) {
            chooseImgs.forEach((v, i) => {
                wx.uploadFile({
                    url: 'https://img.coolcr.cn/api/upload',
                    filePath: v,
                    name: 'image',
                    success: result => {
                        let url = JSON.parse(result.data).data.url;
                        this.UpLoadImgs.push(url);
                        if (i === chooseImgs.length - 1) {
                            wx.hideLoading();
                            this.setData({
                                textVal: '',
                                chooseImgs: [],
                            });
                            wx.navigateBack({
                                delta: 1,
                            });
                        }
                    },
                });
            });
        } else {
            console.log('只提交了文本');
            wx.navigateBack({
                delta: 1,
            });
        }
    },
});
