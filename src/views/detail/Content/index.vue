<template>
  <div>
    <div
      class="article-content markdown-body detail-content"
      v-html="detailData.content"
      ref="imgs"
    ></div>
  </div>
</template>

<script>
import './github-markdown.css'
import { ImagePreview } from 'vant'

export default {
  name: 'Content',
  data() {
    return {}
  },
  props: {
    detailData: {
      type: Object,
      required: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.imgClickFn()
    })
  },
  methods: {
    // 获取所有img,拿到src进行绑定点击事件
    imgClickFn() {
      const imgs = this.$refs.imgs.querySelectorAll('img')
      const images = []
      imgs.forEach((item, index) => {
        images.push(item.src)
        item.onclick = function () {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.detail-content {
  height: 100%;
}
</style>
