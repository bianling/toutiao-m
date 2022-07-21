<template>
  <div>
    <!-- 底部内容区域 -->
    <div class="bottom">
      <van-button plain type="primary" size="mini" round @click="show = true">
        写评论
      </van-button>
      <van-icon name="comment-o" :badge="commentList.total_count" />
      <van-icon
        name="star"
        color="#3296fa"
        v-if="isColleted"
        @click="isColletedFn(false)"
      />
      <van-icon name="star-o" v-else @click="isColletedFn(true)" />
      <van-icon
        name="good-job"
        color="#3296fa"
        v-if="isAttitude"
        @click="likingsFn(false)"
      />
      <van-icon name="good-job-o" v-else @click="likingsFn(true)" />
      <van-icon name="share" @click="showShare = true" />
    </div>
    <!-- 底部内容区域 -->
    <!-- 写评论 -->
    <van-popup v-model="show" position="bottom" :style="{ height: '18%' }">
      <div class="input">
        <van-field
          v-model="message"
          type="textarea"
          maxlength="50"
          placeholder="请输入留言"
          show-word-limit
        />
        <van-button
          hairline
          type="info"
          :disabled="isDisabled"
          @click="articleComment"
          >发布
        </van-button>
      </div>
    </van-popup>
    <!-- 写评论 -->
    <!-- 分享部分 -->
    <van-share-sheet
      v-model="showShare"
      title="立即分享给好友"
      :options="options"
    />
    <!-- 分享部分 -->
  </div>
</template>

<script>
import { articleComment } from '@/apis/comment'
import { collections, unCollections, likings, unLikings } from '@/apis/news'
export default {
  name: 'NavBar',
  data() {
    return {
      isColleted: false,
      isAttitude: 0,
      showShare: false,
      options: [
        [
          { name: '微信', icon: 'wechat' },
          { name: '朋友圈', icon: 'wechat-moments' },
          { name: '微博', icon: 'weibo' },
          { name: 'QQ', icon: 'qq' }
        ],
        [
          { name: '复制链接', icon: 'link' },
          { name: '分享海报', icon: 'poster' },
          { name: '二维码', icon: 'qrcode' },
          { name: '小程序码', icon: 'weapp-qrcode' }
        ]
      ],
      show: false,
      message: ''
    }
  },
  props: {
    commentList: {
      type: Object,
      required: true
    },
    detailData: {
      type: Object,
      required: true
    }
  },
  created() {
    // 用于判断有没有收藏
    this.isColleted = this.detailData.is_collected
    this.isAttitude = this.detailData.attitude
  },
  computed: {
    // 控制发布按钮是否金庸
    isDisabled() {
      return !this.message.trim()
    }
  },
  methods: {
    // 发布评论
    async articleComment() {
      try {
        await articleComment(this.detailData.art_id, this.message)
        this.$emit('addComment')
        this.show = false
        this.message = ''
        this.$toast.success('发布成功')
      } catch (error) {
        if (error.response.status === 401) {
          this.$toast.fail('登录之后才可以发布评论')
          this.show = false
        }
        console.log(error)
      }
    },
    // 收藏或取消收藏
    async isColletedFn(isTrue) {
      try {
        if (isTrue) {
          await collections(this.detailData.art_id)
          this.isColleted = isTrue
          this.$toast.success('已收藏')
        } else {
          await unCollections(this.detailData.art_id)
          this.isColleted = isTrue
          this.$toast.success('取消收藏')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点赞或者取消点赞
    async likingsFn(isTrue) {
      try {
        if (isTrue) {
          await likings(this.detailData.art_id)
          this.isAttitude = 1
          this.$toast.success('已点赞')
        } else {
          await unLikings(this.detailData.art_id)
          this.isAttitude = 0
          this.$toast.success('取消点赞')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  /deep/.van-field__word-limit {
    margin: 0;
  }
  /deep/.van-field {
    background-color: #f5f7f9;
    margin: 30px;
    height: 180px;
  }
  .van-button {
    margin: 0;
    padding: 0;
    margin-right: 35px;
    background-color: #fff;
    border: transparent;
    width: 100px;
    font-size: 28px;
    color: #6ba3d8;
  }
}
.bottom {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 90px;
}
/deep/.van-button {
  width: 280px;
  height: 45px;
  font-size: 0.4rem;
  color: #a7a7a7;
  border-color: #eeeeee;
}
/deep/.van-icon {
  font-size: 38px;
  color: #a7a7a7;
}
</style>
