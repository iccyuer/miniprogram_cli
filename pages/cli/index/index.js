// pages/cli/index/index.js
const app = getApp()
import api from '../../../config/api';
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log('index',options);
        console.log('this', this);
        console.log('app', app);
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

    async testlogin() {
        let params = {
            username: 'abc',
            password: '123'
        }
        let result = await wx.post(`${api.apiserver}/auth/user/login`, params);
        console.log(result);
    },

    async testapi() {
        let result = await wx.get(`${api.apiserver}/auth/user/test`);
        console.log(result);
    },

    async testapi2() {
        let result = await wx.get(`${api.apiserver}/api/ec/sku/list`);
        console.log(result);
    },
})