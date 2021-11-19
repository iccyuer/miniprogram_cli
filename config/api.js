const appid = 'wx696651506a7a12b7'
const constant = {
    fileServer: "https://ec-file.dawangtv.cn",
    apiserver: "http://165.154.24.66",
    downloadFileServe: 'https://shandianfile.yunxiaoxin.net'
}

// urls 小程序的递归模块有问题，暂时使用两层结构，urls>auth>
let urls = {
    auth: {
        authorize: {
            method: 'POST',
            url: constant.apiserver + '/auth/wxa/tutu'
        },
        authorizev2: {
            method: 'POST',
            url: constant.apiserver + '/auth/wxa/v2/tutu'
        },
        updateuserinfo: {
            method: 'POST',
            url: constant.apiserver + '/auth/wxa/hainangolf/updateuserinfo'
        },
        refreshToken: {
            method: 'GET',
            url: constant.apiserver + '/auth/wxa/refreshToken'
        },
        userDetail: {
            method: 'GET',
            url: constant.apiserver + '/auth/user/detail'
        },
        currentTime: {
            method: 'GET',
            url: constant.apiserver + '/auth/currentTime'
        },
        verifyCode: {
            method: 'GET',
            url: constant.apiserver + '/auth/wxa/sendVerifyCode'
        },
        updateusermobile: {
            method: 'POST',
            url: constant.apiserver + '/auth/wxa/hainangolf/updateusermobile'
        }
    },
    baseService: {
        qrcode: {
            method: 'GET',
            url: constant.apiserver + '/api/wxmainapi/createTmpQRCode2'
        },
        fileUpload: {
            method: 'POST',
            url: constant.apiserver + '/file/upload'
        }
    }
}

module.exports = {
    appid: appid,
    server: constant,
    fileServer: constant['fileServer'],
    api: urls,
    apiserver: constant['apiserver'],
}
