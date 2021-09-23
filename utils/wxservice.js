function wxlogin() {
    return new Promise((resolve, reject) => {
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    resolve(res)
                } else {
                    reject('登录失败！' + res.errMsg)
                }
            }
        })
    })
}

function qylogin() {
    return new Promise((resolve, reject) => {

    })
}


export {
    wxlogin,
    qylogin
}
