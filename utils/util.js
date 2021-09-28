const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : `0${n}`
}


/* 判断机型(是否是iphonex之后的机型) */
function judgeModel(model) {
    if (/iPhone X/i.test(model)) {
        return true;
    } else if (/iPhone 11/i.test(model)) {
        return true;
    } else if (/iPhone 12/i.test(model)) {
        return true;
    } else if (/iPhone 13/i.test(model)) {
        return true;
    } else if (
        /iphone\sx/i.test(model) ||
        (/iphone/i.test(model) && /unknown/.test(model)) ||
        /iphone\s11/.test(model) ||
        /iphone\s12/.test(model) ||
        /iphone\s13/.test(model)
    ) {
        return true;
    } else {
        return false;
    }
}

/* 格式化User */
function formatUser(User) {
    let userDetail = {}
    if (User) {
        userDetail = Object.assign(
            {},
            User,
            { passport: User.Passports }
        )
        delete userDetail.Passports
    }
    return userDetail;
}

module.exports = {
    formatTime,
    judgeModel,
    formatUser
}
