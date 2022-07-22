<template>
  <div>
    <van-cell>
      <!-- 左侧头像昵称 -->
      <div slot="title">
        <div class="title">
          <van-image
            width="36"
            height="36"
            :src="commentItem.aut_photo"
            round
          />
          <p>{{ commentItem.aut_name }}</p>
        </div>
      </div>
      <!-- 右侧点赞 -->
      <div slot="default">
        <van-icon
          name="good-job-o"
          v-if="!commentItem.is_liking"
          @click="likeComment"
        />
        <van-icon
          name="good-job"
          class="isTrue"
          v-else
          @click="unLikeComment"
        />
        {{ commentItem.like_count ? commentItem.like_count : '赞' }}
      </div>
      <!-- 下方评论 -->
      <div slot="label" class="label">
        <p>{{ commentItem.content }}</p>
        <div class="time">
          <div>
            <span class="span">{{ commentItem.pubdate }}</span>
          </div>
          <div class="label-bottom">
            <van-button
              plain
              type="primary"
              size="mini"
              round
              @click="popupShow"
            >
              回复 {{ commentItem.reply_count }}
            </van-button>
          </div>
        </div>
      </div>
    </van-cell>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { likeComment, unLikeComment } from '@/apis/news'
export default {
  name: 'Comment',
  data() {
    return {
      isLiking: false
    }
  },
  created() {},
  props: {
    commentItem: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 打开弹窗并且将该评论的内容传送到vuex上
    popupShow() {
      this.setCommentItem(this.commentItem)
      // 先把值传完再把弹窗打开,不然拿不到值可能出现报错
      setTimeout(() => {
        this.$emit('popupShow')
      }, 0)
    },
    // 点赞
    async likeComment() {
      try {
        await likeComment(this.commentItem.com_id)
        if (this.$parent.$parent.$parent.addCommentList) {
          this.$parent.$parent.$parent.addCommentList(this.commentItem.com_id)
        } else {
          this.$emit('addCommentList')
        }
        this.$toast.success('已点赞')
      } catch (error) {
        console.log(error)
      }
    },
    // 取消点赞
    async unLikeComment() {
      try {
        await unLikeComment(this.commentItem.com_id)
        if (this.$parent.$parent.$parent.addCommentList) {
          this.$parent.$parent.$parent.addCommentList(this.commentItem.com_id)
        } else {
          this.$emit('addCommentList')
        }
        this.$toast.success('取消点赞')
      } catch (error) {
        console.log(error)
      }
    },
    ...mapMutations(['setCommentItem'])
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
