<template>
  <div>
    <van-cell
      v-for="(item, index) in highlightData"
      :key="index"
      @click="addSearchValue(index)"
    >
      <van-icon name="search" slot="icon" class="search-icon" />
      <span slot="title" v-html="item"></span>
    </van-cell>
  </div>
</template>

<script>
import { getSearchSuggestion } from '@/apis/search'
export default {
  name: 'SearchSuggestion',
  data() {
    return {
      suggestions: []
    }
  },
  props: {
    keywords: {
      typeof: String,
      required: true
    }
  },
  created() {
    // 获取推荐
    this.getSearchSuggestion()
  },
  methods: {
    // 获取搜索建议
    async getSearchSuggestion() {
      try {
        const { data } = await getSearchSuggestion(this.keywords)
        this.suggestions = data.data.options.filter(Boolean)
        if (!data.data.options[0]) {
          this.$toast.fail('暂无数据')
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 点击推荐搜索列表进行搜索
    addSearchValue(index) {
      this.$emit('suggestionToResult', this.suggestions[index])
    }
  },
  watch: {
    keywords: 'getSearchSuggestion'
  },
  computed: {
    highlightData() {
      if (this.suggestions) {
        const reg = new RegExp(this.keywords, 'ig')
        return this.suggestions.map((str) =>
          str.replace(reg, (match) => `<span style="color:red">${match}</span>`)
        )
      } else {
        return []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search-icon {
  margin-top: 12px;
}
</style>
