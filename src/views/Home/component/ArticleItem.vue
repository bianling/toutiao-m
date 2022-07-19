<template>
  <div>
    <!-- 没有图片时渲染 -->
    <van-cell
      :title="articleInfo.title"
      :label="label"
      v-if="articleInfo.cover.type == 0"
    />
    <!-- 一张图片的时候渲染 -->
    <van-cell
      :title="articleInfo.title"
      :label="label"
      v-if="articleInfo.cover.type == 1"
    >
      <template>
        <van-image
          width="3rem"
          height="2rem"
          :src="articleInfo.cover.images[0]"
        />
      </template>
    </van-cell>
    <!-- 两张图片的时候渲染 -->
    <van-cell :title="articleInfo.title" v-if="articleInfo.cover.type == 3">
      <!-- 标题下方图片区域 -->
      <!-- text区域 -->
      <div slot="label">
        <div class="slot-img">
          <van-image
            width="2.3rem"
            height="2.3rem"
            :src="item"
            v-for="item in articleInfo.cover.images"
            :key="`${item}${Math.random()}`"
          />
        </div>
        <span>{{ label }}</span>
      </div>
    </van-cell>
  </div>
</template>

<script>
import dayjs from '@/utils/dayjs'
export default {
  name: 'ArticleItem',
  props: {
    articleInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    label() {
      const art = this.articleInfo
      const time = dayjs(art.pubdate).fromNow()
      return `${art.aut_name}  ${art.comm_count}评论  ${time}`
    }
  }
}
</script>

<style lang="less" scoped>
.slot-img {
  display: flex;
  justify-content: space-between;
}
</style>
