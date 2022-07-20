import request from '@/utils/request'
import storage from '@/utils/storage'

// 获取推荐列表
export const getSearchSuggestion = (q) => {
    return request({
        url: '/v1_0/suggestion',
        method: 'GET',
        params: {
            q
        }
    })
}

// 获取搜索结果
export const getSearchResult = (q, page) => {
    return request({
        url: '/v1_0/search',
        method: 'GET',
        params: {
            page,
            per_page: 10,
            q
        }
    })
}

// 封装存储本地的历史搜索记录
const HEIMA_TOUTIAO_HISTORY = 'HEIMA_TOUTIAO_HISTORY'
export const getSearchHistory = () => storage.get(HEIMA_TOUTIAO_HISTORY)
export const setSearchHistory = (historyArr) => storage.set(HEIMA_TOUTIAO_HISTORY, historyArr)
