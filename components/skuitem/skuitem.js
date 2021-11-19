// compnents/skuitem.js
import api from '../../config/api';
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        item: {
            type: Object,
            default() {
                return {}
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        fileserver: api.fileServer,
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})
