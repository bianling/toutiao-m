<template>
  <div class="detaile">
    <div class="nav">
      <van-nav-bar title="头条" left-arrow @click-left="onClickLeft" />
    </div>
    <!-- 头部区域 -->
    <div v-if="detailData.aut_id" class="main-title">
      <Title :detailData="detailData" />
    </div>
    <!-- 头部区域 -->
    <!-- 文章内容部分 -->
    <div class="main" v-if="detailData.aut_id">
      <Content :detailData="detailData" />
    </div>
    <!-- 文章内容部分 -->
    <!-- 分隔符 -->
    <div class="hr">
      <div></div>
      <p>正文结束</p>
      <div></div>
    </div>
    <!-- 分隔符 -->
    <!-- 评论区 -->
    <div class="main" v-if="commentList.results">
      <van-list
        v-model="loading"
        @load="onLoad"
        :finished="finished"
        finished-text="没有更多了"
      >
        <Comment
          v-for="(item, index) in commentList.results"
          :key="index"
          :commentItem="item"
          @popupShow="popupShow"
          @addCommentList="addCommentList"
        />
      </van-list>
    </div>
    <!-- 评论区 -->
    <!-- navBar -->
    <div class="navbar" v-if="commentList.results && detailData.aut_id">
      <NavBar
        :commentList="commentList"
        :detailData="detailData"
        @addComment="addCommentList()"
      />
    </div>
    <!-- navBar -->
    <!-- 单挑评论回复区域 -->
    <div class="Popup" v-if="commentItem.com_id">
      <PopupReply ref="Popup" />
    </div>
  </div>
</template>

<script>
import { getArticle, getCommentsList } from '@/apis/news'
import Title from './Title'
import Content from './Content'
import Comment from './Comment'
import dayjs from '@/utils/dayjs'
import NavBar from './NavBar'
import PopupReply from './PopupReply'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Detail',
  data() {
    return {
      detailData: {},
      commentList: {},
      loading: false,
      finished: false
    }
  },
  created() {
    // 获取文章详情
    this.getArticle()
    // 获取文章评论区
    this.getCommentsList()
  },
  methods: {
    // 返回
    onClickLeft() {
      this.$router.back()
    },
    // 获取文章详情
    async getArticle() {
      try {
        this.detailData = (await getArticle(this.$route.params.id)).data.data
      } catch (error) {
        console.log(error)
      }
    },
    // 获取文章评论区 id是二级评论的id,一级评论不传
    async getCommentsList(id = '') {
      try {
        const lastId = this.commentList.last_id || ''
        const res = (await getCommentsList(this.$route.params.id, lastId)).data
          .data
        // 将时间进行转换
        res.results.forEach((item, index) => {
          res.results[index].pubdate = dayjs(item.pubdate).fromNow()
        })
        // 判断是不是第一次,是第一次直接赋值,不是就将内容push进去\
        if (!this.commentList.results) {
          this.commentList = res
        } else {
          this.commentList.results.push(...res.results)
          this.commentList.last_id = res.last_id
        }
        // 判断目前文章数量是不是和总文章数量相同,相同结束
        if (this.commentList.results.length >= res.total_count) {
          this.finished = true
        }
        this.loading = false
      } catch (error) {
        console.log(error)
      }
      // 判断有没有id,如果有而且查找不到进行递归查找
      if (id) {
        // 如果是二级点赞,将vuex中存储的内容重新赋值
        const index = this.commentList.results.findIndex(
          (item) => item.com_id === id
        )
        // 如果查找到了直接赋值,没有查找到需要继续往下查找
        if (index !== -1) {
          this.setCommentItem(this.commentList.results[index])
        } else {
          this.getCommentsList(id)
        }
      }
    },
    // 当发布评论时和点赞时重新获取 id是二级评论的id,一级评论不传
    async addCommentList(id = '') {
      try {
        const res = (await getCommentsList(this.$route.params.id)).data.data
        // 将时间进行转换
        res.results.forEach((item, index) => {
          res.results[index].pubdate = dayjs(item.pubdate).fromNow()
        })
        this.commentList = res
        this.commentList.last_id = res.last_id
        this.finished = false
        // 判断目前文章数量是不是和总文章数量相同,相同结束
        if (this.commentList.results.length >= res.total_count) {
          this.finished = true
        }
        // 如果是二级点赞,将vuex中存储的内容重新赋值
        const index = this.commentList.results.findIndex(
          (item) => item.com_id === id
        )
        // 如果查找到了直接赋值,没有查找到需要继续往下查找
        if (index !== -1) {
          this.setCommentItem(this.commentList.results[index])
        } else {
          this.getCommentsList(id)
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 触底加载
    onLoad() {
      this.getCommentsList()
    },
    // 点击回复弹出
    popupShow() {
      this.$refs.Popup.isPopupReplyShow = true
    },
    // 获取vuex中的方法
    ...mapMutations(['setCommentItem'])
  },
  components: {
    Title,
    Content,
    Comment,
    NavBar,
    PopupReply
  },
  computed: {
    ...mapState(['commentItem'])
  }
}
</script>

<style lang="less" scoped>
.detaile {
  padding-top: 90px;
  padding-bottom: 90px;
}

.navbar {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 90px;
  background-color: #fff;
  z-index: 99;
  border-top: 2px solid #d8d8d8;
}
.main {
  padding: 45px 32px;
}
.hr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  div {
    flex: 1;
    height: 2px;
    background-color: #f5f6f7;
  }
  p {
    color: #969799;
    font-size: 0.37333rem;
    margin: 0 30px;
  }
}
.Popup {
  z-index: 999999999;
}
/deep/.van-nav-bar__content {
  background-color: #3296fa;
  .van-nav-bar__title {
    color: #fff;
  }
  .van-icon {
    color: #fff;
  }
}
.nav {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 3;
}
</style>
