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
        url: `/v1_0/articles/${id}`,
        method: 'GET'
    })
}

// 获取文章评论列表
export const getCommentsList = (id, offset) => {
    return request({
        url: '/v1_0/comments',
        method: 'GET',
        params: {
            type: 'a',
            source: id,
            offset,
            limit: 10
        }
    })
}
// 获取文章评论回复列表
export const getCommentTowLsit = (id, offset) => {
    return request({
        url: '/v1_0/comments',
        method: 'GET',
        params: {
            type: 'c',
            source: id,
            offset,
            limit: 10
        }
    })
}

// 收藏文章
export const collections = (target) => {
    return request({
        url: '/v1_0/article/collections',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            target
        }
    })
}

// 取消收藏
export const unCollections = (id) => {
    return request({
        url: `/v1_0/article/collections/${id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// 对文章点赞
export const likings = (target) => {
    return request({
        url: '/v1_0/article/likings',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            target
        }
    })
}

// 取消文章点赞
export const unLikings = (id) => {
    return request({
        url: `/v1_0/article/likings/${id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// 对评论或者回复进行点赞
export const likeComment = (target) => {
    return request({
        url: '/v1_0/comment/likings',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            target
        }
    })
}

// 取消点赞
export const unLikeComment = (id) => {
    return request({
        url: `/v1_0/comment/likings/${id}`,
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
