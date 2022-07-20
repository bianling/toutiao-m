import request from '@/utils/request'

// 获取文章列表
export const getArticleList = (channelId, timestamp) => {
    return request({
        url: '/v1_0/articles',
        method: 'GET',
        params: {
            channel_id: channelId,
            timestamp
        }
    })
}

// 获取文章详情
export const getArticle = (id) => {
    return request({
        url: '/v1_0/articles/:article_id',
        method: 'GET',
        data: {
            article_id: id
        }
    })
}
