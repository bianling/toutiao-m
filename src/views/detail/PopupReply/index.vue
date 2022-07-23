<template>
  <div>
    <van-popup
      v-model="isPopupReplyShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 头部区域 -->
      <div class="seize-a-seat"></div>
      <van-nav-bar
        :title="
          commentItem.reply_count
            ? `${commentItem.reply_count}条回复`
            : '暂无回复'
        "
        @click-left="onClickLeft"
        left-arrow
      />
      <!-- 头部区域 -->
      <!-- 文章区域 -->
      <div class="commentItem">
        <Comment :commentItem="commentItem" />
      </div>
      <!-- 文章区域 -->
      <div class="cell">
        <van-cell title="全部回复" />
      </div>
      <!-- 评论的回复 -->
      <div class="commentTowLsit">
        <PopupItem />
      </div>
      <!-- 评论的回复 -->
      <!-- 底部回复栏 -->
      <div class="seize-a-seat"></div>
      <div class="bottom-popup">
        <van-button type="default" round @click="show = true">回复</van-button>
      </div>
      <!-- 底部回复栏 -->
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
            >回复
          </van-button>
        </div>
      </van-popup>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Comment from '../Comment'
import PopupItem from './PopupItem'
import { articleComment } from '@/apis/comment'
export default {
  name: 'PopupReply',
  data() {
    return {
      isPopupReplyShow: false,
      commentTowLsit: {},
      show: false,
      message: ''
    }
  },
  watch: {
    // 监听弹出层的弹出,弹出时重新获取数据
    isPopupReplyShow() {
      if (this.isPopupReplyShow && this.$children[0].$children[2]) {
        this.$children[0].$children[2].getCommentTowLsit()
      }
    }
  },
  methods: {
    // 关闭弹出层
    onClickLeft() {
      this.isPopupReplyShow = false
    },
    // 发布评论
    async articleComment() {
      try {
        await articleComment(
          this.commentItem.com_id,
          this.message,
          this.$route.params.id
        )
        this.$toast.success('回复成功')
        this.message = ''
        this.show = false
        // 回复成功重新调用评论数据
        this.$children[0].$children[2].getCommentTowLsit()
        // 更新所有评论回复实现头部回复总数的刷新
        this.$parent.addCommentList(this.commentItem.com_id)
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    // 控制发送按钮
    isDisabled() {
      return !this.message.trim()
    },
    ...mapState(['commentItem'])
  },
  components: {
    Comment,
    PopupItem
  }
}
</script>

<style lang="less" scoped>
.commentItem {
  padding: 0 32px;
}
.cell {
  margin: 0 30px;
  border-top: 1px solid #f5f6f7;
  border-bottom: 1px solid #f5f6f7;
}
/deep/.van-nav-bar__content {
  background-color: #fff !important;
  .van-icon {
    color: #1989fa !important;
  }
  .van-nav-bar__title {
    color: #323233 !important;
  }
}
.commentTowLsit {
  padding: 0 32px;
}
.bottom-popup {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 100px;
  background-color: #ff69b4;
  .van-button {
    width: 640px;
    height: 80px;
  }
}
.seize-a-seat {
  width: 100%;
  height: 100px;
}
/deep/.van-nav-bar__content {
  width: 100%;
  position: fixed;
  top: 0;
}
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
</style>
