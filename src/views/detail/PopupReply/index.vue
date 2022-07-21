<template>
  <div>
    <van-popup
      v-model="isPopupReplyShow"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 头部区域 -->
      <van-nav-bar title="暂无回复" @click-left="onClickLeft" left-arrow />
      <!-- 头部区域 -->
      <!-- 文章区域 -->
      <div class="commentItem">
        <Comment :commentItem="commentItem" />
      </div>
      <!-- 文章区域 -->
      <div class="cell">
        <van-cell title="全部回复" />
      </div>
    </van-popup>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Comment from '../Comment'
export default {
  name: 'PopupReply',
  data() {
    return {
      isPopupReplyShow: false
    }
  },
  computed: {
    ...mapState(['commentItem'])
  },
  components: {
    Comment
  },
  methods: {
    // 关闭弹出层
    onClickLeft() {
      this.isPopupReplyShow = false
    }
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
</style>
