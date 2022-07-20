<template>
  <div>
    <!-- 上方历史记录文字行 -->
    <van-cell title="搜索历史">
      <!-- 删除小图标 -->
      <span slot="default">
        <van-icon
          name="delete-o"
          @click="iconIsShowOrRemove"
          v-show="iconIsShow"
        />
      </span>
      <!-- 删除小图标 -->
      <span slot="default" v-show="!iconIsShow" @click="removeAllHistory"
        >全部删除</span
      >
      <span
        slot="default"
        class="ok"
        v-show="!iconIsShow"
        @click="iconIsShowOrRemove"
        >完成
      </span>
    </van-cell>
    <!-- 上方历史记录文字行 -->
    <!-- 历史记录 -->
    <van-cell
      :title="item"
      v-for="(item, index) in historyArr"
      :key="index"
      @click="goResultOrRemove(item, index)"
    >
      <van-icon name="close" slot="default" v-show="!iconIsShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: 'SearchHistory',
  data() {
    return {
      iconIsShow: true,
      isRemove: false
    }
  },
  props: {
    historyArr: {
      typeof: Array,
      required: true
    }
  },
  methods: {
    // 点击历史记录中的内容进行搜索
    goResultOrRemove(val, index) {
      if (this.isRemove) {
        // 删除某一项 传递索引
        this.$emit('removeIndexHistory', index)
      } else {
        // 搜索,传递搜索内容
        this.$emit('suggestionToResult', val)
      }
    },
    // 删除所有历史搜索内容
    removeAllHistory() {
      this.$emit('removeAllHistory')
    },
    // 控制删除或者跳转和显示隐藏
    iconIsShowOrRemove() {
      this.iconIsShow = !this.iconIsShow
      this.isRemove = !this.isRemove
    }
  }
}
</script>

<style lang="less" scoped>
.ok {
  margin-left: 14px;
}
</style>
