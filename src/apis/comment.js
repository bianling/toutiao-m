import request from '@/utils/request'

/**
 *  文章评论
 * @param {string} target //评论的目标id（评论文章即为文章id，对评论进行回复则为评论id
 * @param {string} content //评论内容
 * @param {string} artId //文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
 * @returns
 */
export const articleComment = (target, content, artId) => {
    return request({
        url: '/v1_0/comments',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            target,
            content,
            art_id: artId
        }
    })
}
