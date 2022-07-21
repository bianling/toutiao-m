<template>
  <div>
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onLoad"
      success-text="刷新成功"
    >
      <van-list
        @load="onLoad"
        offset="300"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <ArticleItem
          v-for="item in articles"
          :key="item.art_id"
          :articleInfo="item"
          @click.native="goDetail(item.art_id)"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticleList } from '@/apis/news'
import ArticleItem from './ArticleItem.vue'
export default {
  name: 'ArticleList',
  data() {
    return {
      loading: false,
      articles: [],
      pre_timestamp: '',
      finished: false,
      error: false,
      refreshing: false
    }
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    }
  },
  created() {
    // 获取文章列表
    this.getArticleList()
  },
  methods: {
    // 获取文章列表
    async getArticleList() {
      try {
        const { data } = await getArticleList(this.id, Date.now())
        this.articles = data.data.results
        this.pre_timestamp = data.data.pre_timestamp
      } catch (err) {
        if (err.response.status === 400) {
          throw new Error(err.response.data.message)
        } else {
          this.$toast.fail('网络繁忙,请刷新重试')
        }
      }
    },
    // 触底加载下一页数据
    async onLoad() {
      try {
        // if (Math.random() < 0.5) {
        //   throw new Error('出错了')
        // }
        const { data } = await getArticleList(this.id, this.pre_timestamp)
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        this.pre_timestamp = data.data.pre_timestamp
        if (this.refreshing) {
          this.articles.unshift(...data.data.results)
        } else {
          this.articles.push(...data.data.results)
        }
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshing = false
      }
    },
    // 跳转文章详情页面
    goDetail(id) {
      this.$router.push({
        name: 'detail',
        params: {
          id
        }
      })
    }
  },
  components: {
    ArticleItem
  }
}
</script>

<style lang="less" scoped></style>
