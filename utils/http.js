const log = require("./log.js");
export const $http = {
    Prequest(method = 'GET') {
        const context = this;
        /**
         * noModal: 接口是否需要弹提示框
         */
        return function(url, data = {}, header = {}, noModal) {
            console.log(`发${method}请求:${url}`);
            log.info(`发${method}请求:${url}`);
            return new Promise(function(resolve, reject) {
                if (!wx.token) {
                    return reject('token is null');
                }
                let defaultheader = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${wx.token}`
                };
                for (let key in header) {
                    defaultheader[key] = header[key];
                }
                wx.request({
                    url,
                    data,
                    method,
                    header: defaultheader,
                    success: function(res) {
                        // console.log('request res', res);
                        if (res && res.data) {
                            context._setCurrentTime(res.header.Date);
                            if (res.data.errCode == '200002') {
                                //token 失效
                                !noModal && wx.showModal({
                                    confirmColor: '#7ec792',
                                    content: `登陆凭证失效，重新获取中`,
                                    showCancel: false,
                                    success: async function() {
                                        wx.removeStorageSync('user:token');
                                        context._refreshUserInfo();
                                        wx.startPullDownRefresh();
                                    }
                                });
                                wx.hideLoading();
                                reject(res);
                                return;
                            } else if (res.data.errorCode) {
                                console.error(res);
                                let msg =
                                    res.data.errorMsg || res.data.messasge || res.data.errmsg;
                                !noModal && wx.showModal({
                                    confirmColor: '#7ec792',
                                    content: msg,
                                    showCancel: false
                                });

                                wx.hideLoading();
                                reject(res);
                                return;
                            }
                        }
                        resolve(res.data);
                    },
                    fail: function(err) {
                        console.error('系统错误', err);
                        log.error(
                            '请求错误的信息是' + JSON.stringify(err) + '请求错误的URL是' + url
                        );
                        let errorMsg = '';
                        if (
                            err.errMsg.indexOf('request:fail timeout') != -1 ||
                            err.errMsg.indexOf('request:fail 请求超时') != -1 ||
                            err.errMsg.indexOf('request:fail socket time') != -1
                        ) {
                            errorMsg = '网络超时，请刷新重试';
                        } else if (err.errMsg.indexOf('request:fail request unknow host error') != -1) {
                            errorMsg = '网络请求异常，请删除小程序重新进入';
                        } else if (err.errMsg.indexOf("request:fail -109:net::ERR_ADDRESS_UNREACHABLE") != -1) {
                            errorMsg = "抱歉，当前网络不可用，请检查网络后，下拉刷新或退出重新访问！";
                        } else {
                            errorMsg = '网络错误，请刷新重试';
                        }
                        !noModal && wx.showModal({
                            confirmColor: '#7ec792',
                            content: errorMsg || err.errMsg,
                            showCancel: false
                        });
                        wx.hideLoading();
                        reject(err);
                    }
                });
            });
        };
    },

    //上传文件
    Pupload() {
        return function(url, filePath, name = 'file', formData = {}, header = {}) {
            return new Promise(function(resolve, reject) {
                let defaultheader = {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${wx.token}`
                };
                for (let key in header) {
                    defaultheader[key] = header[key];
                }
                wx.uploadFile({
                    url,
                    filePath,
                    name,
                    formData,
                    header: defaultheader,
                    success: function(res) {
                        //console.log(res);
                        resolve(res.data);
                    },
                    fail: function(err) {
                        console.log('err, ', err);
                        reject(err);
                    }
                });
            });
        };
    },

    request(options) {
        return new Promise((resolve, reject) => {
            wx.request({
                url: options.url, //仅为示例，并非真实的接口地址
                method: options.method,
                data: options.data,
                success(res) {
                    resolve(res.data)
                },
                fail(err) {
                    reject(err)
                }
            })

        })
    },
}