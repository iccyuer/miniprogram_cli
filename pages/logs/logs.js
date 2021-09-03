// logs.js
const util = require('../../utils/util.js')

Page({
    data: {
        logs: []
    },
    onLoad() {
        console.log('log onLoad')
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(log => {
                return {
                    date: util.formatTime(new Date(log)),
                    timeStamp: log
                }
            })
        })
    }
})
