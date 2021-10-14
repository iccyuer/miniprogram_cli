// pages/cli/login/login.js
const app = getApp()
import api from '../../../config/api';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showMobile: false,
        code: '',
        canIuseUserProfile: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (wx.getUserProfile) {
            this.canIuseUserProfile = true;
        } else {
            this.canIuseUserProfile = false;
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    async getUserProfile() {
        if (wx.getUserProfile) {
            wx.getUserProfile({
                desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
                success: async (res) => {
                    if (this.agreeStatus) {
                        return;
                    }
                    this.agreeStatus = true;
                    if (!!res.userInfo) {
                        let userInfo = {
                            nickname: res.userInfo.nickName,
                            gender: res.userInfo.gender,
                            headimg: res.userInfo.avatarUrl,
                            country: res.userInfo.country,
                            city: res.userInfo.city,
                            province: res.userInfo.province,
                        }
                        let result = await wx.post(`${api.apiserver}/auth/user/updateinfo`, userInfo);
                        if (result.state != 'error') {
                            await app._refreshUserInfo();
                            this.agreeStatus = false;
                            app.globalData.needUserinfo = false;
                            this.showUserInfo = false;
                            this.showMobile = !wx.userInfo.mobile;
                            //此处要判断是否goback
                            this.checkPage()
                        } else {
                            this.agreeStatus = false;
                        }
                    }
                    this.agreeStatus = false;
                }
            })
        }
    },
})