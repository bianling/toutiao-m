<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell v-for="(item, index) in commentTowLsit.results" :key="index">
        <!-- 左侧头像昵称 -->
        <div slot="title">
          <div class="title">
            <van-image width="36" height="36" :src="item.aut_photo" round />
            <p>{{ item.aut_name }}</p>
          </div>
        </div>
        <!-- 右侧点赞 -->
        <div slot="default">
          <van-icon
            name="good-job-o"
            v-if="!item.is_liking"
            @click="likeComment(item.com_id)"
          />
          <van-icon
            name="good-job"
            class="isTrue"
            v-else
            @click="unLikeComment(item.com_id)"
          />
          {{ item.like_count ? item.like_count : '赞' }}
        </div>
        <!-- 下方评论 -->
        <div slot="label" class="label">
          <p>{{ item.content }}</p>
          <div class="time">
            <div>
              <span class="span">{{ item.pubdate }}</span>
            </div>
            <div class="label-bottom">
              <van-button plain type="primary" size="mini" round>
                回复 {{ item.reply_count }}
              </van-button>
            </div>
          </div>
        </div>
      </van-cell>
    </van-list>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
import { getCommentTowLsit, likeComment, unLikeComment } from '@/apis/news'
import { mapState } from 'vuex'
export default {
  name: 'PopupItem',
  data() {
    return {
      commentTowLsit: {},
      finished: false,
      loading: true,
      lastId: ''
    }
  },
  created() {
    this.getCommentTowLsit()
  },
  methods: {
    // 获取评论的回复
    async getCommentTowLsit() {
      try {
        // 将时间修改好,放入容器中存储
        const res = await getCommentTowLsit(this.commentItem.com_id)
        res.data.data.results.forEach((item) => {
          item.pubdate = dayjs(item.pubdate).fromNow()
        })
        this.commentTowLsit = res.data.data
        this.lastId = res.data.data.last_id
        // 判断评论回复的总数量,进行终止
        if (this.commentTowLsit.results.length >= res.data.data.total_count) {
          this.finished = true
        }
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
    // 下拉刷新获取数据
    async onLoad() {
      try {
        const res = await getCommentTowLsit(
          this.commentItem.com_id,
          this.lastId
        )
        // 保存最后一项的id 用于下次使用
        this.lastId = res.data.data.last_id
        // 格式化时间
        res.data.data.results.forEach((item) => {
          item.pubdate = dayjs(item.pubdate).fromNow()
        })
        // 将新请求的数据push到数据列表中
        this.commentTowLsit.results.push(...res.data.data.results)
        // 判断是否加载完所有的数据
        if (this.commentTowLsit.results.length >= res.data.data.total_count) {
          this.finished = true
        }
        this.loading = false
      } catch (error) {
        console.log(error)
      }
    },
    // 点赞
    async likeComment(id) {
      try {
        await likeComment(id)
        this.$toast.success('已点赞')
        // 点赞成功,重新获取数据
        this.getCommentTowLsit()
      } catch (error) {
        console.log(error)
      }
    },
    // 取消点赞
    async unLikeComment(id) {
      try {
        await unLikeComment(id)
        this.$toast.success('取消点赞')
        // 点赞成功,重新获取数据
        this.getCommentTowLsit()
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    ...mapState(['commentItem'])
  }
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

.van-cell__title {
  flex: 9;
}
.van-cell__value {
  height: 100%;
}
.van-cell {
  margin-top: 30px;
}
.title {
  display: flex;
  p {
    margin-left: 20px;
    color: #406599;
    font-size: 0.34667rem;
  }
}
.time {
  display: flex;
  .span {
    display: inline-block;
    margin-top: 13px;
    font-size: 0.25333rem;
    color: #222;
    margin-right: 30px;
  }
}
.label {
  margin-left: 92px;
  p {
    font-size: 0.42667rem;
    color: #222;
    margin-bottom: 32px;
  }
  .label-bottom {
    height: 48px;
    line-height: 48px;
    margin-bottom: 30px;

    .van-button {
      font-size: 12px;
      color: #000;
      border: 1px #edeff1 solid;
      padding-left: 25px;
      padding-right: 25px;
      margin-bottom: 20px;
    }
  }
}
.isTrue {
  color: #3296fa;
}
</style>
