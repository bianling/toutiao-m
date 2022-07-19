import request from '@/utils/request'
import storage from '@/utils/storage'

// 获取用户频道
export const getMyChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}

// 获取所有频道
export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/channels'
    })
}

// 封装存储本地的方法
const HEIMA_TOUTIAO_CHANNELS = 'HEIMA_TOUTIAO_CHANNELS'
export const getMyChannelsByLocal = () => storage.get(HEIMA_TOUTIAO_CHANNELS)
export const setMyChannelToLocal = (channel) => storage.set(HEIMA_TOUTIAO_CHANNELS, channel)

// 删除用户频道  /v1_0/user/channels/:target
export const delMyChannel = (target) => {
    return request({
        url: `/v1_0/user/channels/${target}`,
        method: 'DELETE'
    })
}

// 添加用户频道 /v1_0/user/channels
export const addMyChannel = (id, seq) => {
    return request({
        url: '/v1_0/user/channels',
        method: 'PATCH',
        data: {
            channels: [{ id, seq }]
        }
    })
}
