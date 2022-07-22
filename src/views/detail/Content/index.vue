<template>
  <div
    class="article-content markdown-body detail-content"
    v-html="detailData.content"
  ></div>
</template>

<script>
import './github-markdown.css'
export default {
  name: 'Content',
  props: {
    detailData: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.detail-content {
  height: 100%;
}
</style>
