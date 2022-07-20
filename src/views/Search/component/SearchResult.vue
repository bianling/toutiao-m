<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getSearchResult"
    >
      <van-cell
        :title="item.title"
        v-for="item in resultList"
        :key="item.art_id"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResult } from '@/apis/search'
export default {
  name: 'SearchResult',
  data() {
    return {
      resultList: [], // 存储搜索结果
      page: 1,
      loading: false,
      finished: false
    }
  },
  props: {
    keywords: {
      typeof: String,
      required: true
    },
    historyArr: {
      typeof: Array,
      required: true
    }
  },
  created() {
    // 每次创建路由说明进行了搜索,将搜索的内容进行保存用于历史记录
    this.$emit('setLostorage', this.keywords)
  },
  methods: {
    // 获取搜索结果列表
    async getSearchResult() {
      try {
        const list = (await getSearchResult(this.keywords, this.page)).data.data
          .results
        this.page += 1
        // 返回回来的数据不足设定值10的时加载结束
        if (list.length < 10) {
          this.finished = true
          this.loading = false
        }
        this.resultList.push(...list)
        this.loading = false
      } catch (error) {
        this.$toast.tail('网络繁茂,请重试')
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
