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
