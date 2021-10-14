// app.js
import 'base/Page'
import util from './utils/util';
import { $http } from './utils/http';
import * as $wx from './utils/wxservice';
import api from './config/api';
import { serverTimeConfig } from './config/config';
App({
    globalData: {
        launched: false, // app 是否走完了onLaunch
        scene: null, // 启动场景
        shareTicket: null, // 分享来源
        environment: null, // 企业微信环境
        loginInfo: {
            code: '' // wx.login的code
        },
        needUserinfo: false, // 是否需要用户信息(注册与否)
        isIphoneX: false, // 是否是iphonex+
        timeData: {
            serverTimeout: null,
            serverTime: 0,
            diffTime: 0
        }
    },
    async onLaunch(options) {
        /* -------- @1.app启动配置 -------- */
        let { scene, query } = options;
        console.log('optionsoptionsoptions', options)
        let result = wx.getSystemInfoSync();
        this.globalData.environment = result.environment || ''; //取运行环境
        console.log('current environment is ', this.globalData.environment);
        try {
            this.globalData.isIphoneX = util.judgeModel(result.model);
        } catch (err) {
            console.log('getSystemInfoSync', err);
            log.error('getSystemInfoSync', err.message);
        }



        wx.get = $http.Prequest.call(this, 'GET');
        wx.post = $http.Prequest.call(this, 'POST');
        wx.upload = $http.Pupload();

        /* -------- @2.获取Token -------- */
        await this._initToken();

        /* -------- @3.获取User -------- */
        let userinfo = (wx.userInfo = wx.getStorageSync('user:detail') || {});
        console.log('in app.vue  launch, userinfo is(from local) ', userinfo);
        // eventTrack.setUid(userinfo.id);
        if (!userinfo.nickname) {
            await this._refreshUserInfo();
        }

    },

    /**
 * 获取User
 */
    async _refreshUserInfo() {
        console.log('into refresh user info');
        let obj = await wx.get(`${api.api.auth.userDetail.url}`);
        let userDetail = util.formatUser(obj);
        console.log('refresh user info done, user info is ', userDetail);
        wx.userInfo = userDetail;
        wx.setStorage({ key: 'user:detail', data: userDetail });
    },

    /**
     * 获取Token
     */
    async _initToken() {
        //初始化token 数据以globalData中为准
        let needlogin = false;
        let token = wx.getStorageSync('user:token');
        let str_expireTime = wx.getStorageSync('user:expireTime');
        if (!token) {
            console.log('token is null, wait to login');
            needlogin = true;
        }

        if (!str_expireTime) {
            needlogin = true;
            console.log('expiretime is null, wait to login');
        } else {
            let _now = parseFloat(new Date().getTime());
            let _expireTime = parseFloat(str_expireTime);
            if (!_expireTime || _expireTime - _now <= 86400000) {
                needlogin = true;
                console.log('expiretime is expired, wait to login');
            }
        }
        console.log('needlogin',needlogin)
        if (needlogin) {
            await this._login();
        } else {
            wx.token = token;
            let openid = wx.getStorageSync('user:openid');
            // eventTrack.setOpenid(openid);
        }
    },

    /**
     * 登录
     */
    async _login() {
        let login_result;
        let url = `${api.api.auth.authorizev2.url}`;
        if (this.globalData.environment == 'wxwork') {
            console.log('we go qy login');
            login_result = await $wx.qylogin();
            url = `${api.api.auth.authorizeqy.url}`;
        } else {
            login_result = await $wx.wxlogin();
        }
        console.log(
            ' in app.vue login method:login_result is ' + login_result.code
        );
        this.globalData.loginInfo.code = login_result.code;
        this.globalData.codetimer = setTimeout(() => {
            this.globalData.loginInfo.code = null;
        }, 1000 * 60 * 60 * 1);
        let formdata = {
            code: login_result.code,
            scene: this.globalData.scene,
            //utm_campaign : self.globalData.scene
            //utm_source : JSON.stringify(options)
            environment: this.globalData.environment
        };
        let res = await $http.request({
            url: url,
            data: formdata,
            method: 'POST'
        });
        var openid = '';
        if (res.userinfo.identifier) {
            openid = res.userinfo.identifier;
        } else {
            let info = res.userinfo.Passports;
            info.map(item => {
                if (item.appid == api.appid) {
                    openid = item.identifier;
                }
            });
        }
        console.log('app.vue: login method openid==', openid);
        this.globalData.openid = openid;
        wx.setStorage({ key: 'user:openid', data: openid });
        // eventTrack.setOpenid(openid);
        wx.token = res.token;
        wx.setStorage({ key: 'user:token', data: wx.token });
        let userDetail = util.formatUser(res.userinfo);
        wx.userInfo = userDetail;
        wx.setStorage({ key: 'user:detail', data: userDetail });
        let duration = 60 * 60 * 24 * 6 * 1000;
        wx.setStorage({
            key: 'user:expireTime',
            data: new Date().getTime() + duration
        });
        // eventTrack.setUid(userDetail.id);
        return login_result;
    },

    async _setCurrentTime(date) {
        clearTimeout(this.globalData.timeData.serverTimeout);
        this.globalData.timeData.serverTime = new Date(date).getTime();
        this.globalData.timeData.diffTime = new Date().getTime() - this.globalData.timeData.serverTime;
        serverTimeConfig.activeSync && (this.globalData.timeData.serverTimeout = setTimeout(async () => {
            await wx.get(`${api.server.apiserver}/auth/currentTime`);
        }, serverTimeConfig.activeSyncTime || 10000));
    },

    async _getCurrentTime() {
        if (!!this.globalData.timeData.diffTime) {
            return new Date().getTime() - this.globalData.timeData.diffTime;
        } else {
            let result = await wx.get(`${api.server.apiserver}/auth/currentTime`);
            return result.currenttime;
        }
    }
})
