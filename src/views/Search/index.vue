<template>
  <div class="search-index">
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="keywords"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="$router.back()"
        @focus="visibleSearchSuggestion"
      />
    </form>
    <!-- 搜索框 -->
    <component
      :is="componentName"
      :keywords="keywords"
      @suggestionToResult="goResult"
      @setLostorage="setLostorage"
      :historyArr="historyArr"
      @removeIndexHistory="removeIndexHistory"
      @removeAllHistory="removeAllHistory"
    ></component>
  </div>
</template>

<script>
import SearchSuggestion from './component/SearchSuggestion.vue'
import SearchResult from './component/SearchResult.vue'
import SearchHistory from './component/SearchHistory.vue'
import { getSearchHistory, setSearchHistory } from '@/apis/search'

export default {
  name: 'Search',
  data() {
    return {
      keywords: '',
      isShowSearchResult: false,
      historyArr: []
    }
  },
  created() {
    // 获取历史搜索记录
    this.historyArr = getSearchHistory() || []
  },
  computed: {
    componentName() {
      if (this.keywords.trim() === '') {
        // 历史记录
        return 'SearchHistory'
      }
      if (this.isShowSearchResult) {
        // 搜索结果
        return 'SearchResult'
      }
      // 搜索建议
      return 'SearchSuggestion'
    }
  },
  methods: {
    // 改成搜索结果页面
    onSearch() {
      this.isShowSearchResult = true
    },
    // 获取焦点改成搜索建议
    visibleSearchSuggestion() {
      this.isShowSearchResult = false
    },
    // 点击历史记录中的某一项进行搜索
    goResult(val) {
      this.isShowSearchResult = true
      this.keywords = val
    },
    // 用于修改历史记录和本地存储历史记录
    setLostorage(keywords) {
      this.historyArr = this.historyArr.filter((item) => item !== keywords)
      this.historyArr.unshift(keywords)
      setSearchHistory(this.historyArr)
    },
    // 用于删除历史记录中的某一项
    removeIndexHistory(index) {
      this.historyArr.splice(index, 1)
      setSearchHistory(this.historyArr)
    },
    // 删除所有历史记录
    removeAllHistory() {
      this.historyArr = []
      setSearchHistory(this.historyArr)
    }
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  }
}
</script>

<style lang="less" scoped>
.search-index {
  background-color: #f5f7f9;
  min-height: 100vh;
}
.van-search {
  background-color: #328ffe;
}
.van-search__action {
  color: #fff;
}
</style>
