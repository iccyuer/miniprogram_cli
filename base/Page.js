// const oldPage = Page;

// Page = function(option) {
//     console.log('init basePage',option)

//     // onLoad
//     const oldOnLoad = option.onLoad
//     option.onLoad = function(options) {
//         console.log('base onLoad',options)
//         oldOnLoad && oldOnLoad.apply(this, arguments)
//     }

//     // onShow
//     const oldOnShow = option.onShow
//     option.onShow = function() {
//         console.log('base onShow')
//         oldOnShow && oldOnShow.apply(this, arguments)
//     }

//     // Page
//     oldPage.apply(this, arguments);
// }


export function enhancePage(options) {
    console.log('init enhancePage',options)
    options = enhance(options)
  
    return Page(options)
  
    function enhance(options) {
        const originOnLoad = options.onLoad
        const originOnShow = options.onShow

        return options = {
            ...options,
            onLoad: function (onLoadOptions) {
                console.log('enhancePage onLoad', onLoadOptions)
                // originOnLoad && originOnLoad.apply(this, arguments)
                originOnLoad && originOnLoad.call(this, onLoadOptions)
            },
            onShow: function () {
                console.log('enhancePage onShow')
                originOnShow && originOnShow.apply(this)
            }
        }
    }
}