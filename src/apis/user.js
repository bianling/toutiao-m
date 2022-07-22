import request from '@/utils/request'

/**
 *登录
 * @param {String} mobile 手机号
 * @param {String} code  验证码
 * @returns  Promise
 */
export const login = (mobile, code) => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data: {
            mobile,
            code
        }
    })
}

// 发送验证码
export const sendCode = (mobile) => {
    return request({
        url: `/v1_0/sms/codes/${mobile}`
    })
}

// 获取用户信息
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user'
    })
}

// 关注用户
export const follow = (id) => {
    return request({
        url: '/v1_0/user/followings',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            target: id
        }
    })
}

// 取消关注
export const unFollow = (id) => {
    return request({
        url: `/v1_0/user/followings/${id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// 获取用户个人资料
export const getUserProfile = () => {
    return request({
        url: '/v1_0/user/profile',
        method: 'GET'
    })
}

// 编辑用户个人资料
export const setUserProfile = (data) => {
    return request({
        url: '/v1_0/user/profile',
        method: 'PATCH',
        data
    })
}

// 编辑用户头像
export const setUserPhoto = (file) => {
    return request({
        url: '/v1_0/user/photo',
        method: 'PATCH',
        data: file
    })
}
