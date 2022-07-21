<template>
  <div>
    <h1>{{ detailData.title }}</h1>
    <div class="user-info">
      <div class="img-div">
        <img :src="detailData.aut_photo" />
      </div>
      <div class="user-info-name">
        <p>{{ detailData.aut_name }}</p>
        <div>3年前</div>
      </div>
      <!-- 关注按钮 -->
      <van-button
        type="info"
        round
        v-if="!isTollow"
        @click="followFn(detailData.aut_id)"
      >
        <van-icon name="plus" size="12px" />
        关注
      </van-button>
      <van-button
        plain
        type="primary"
        round
        color="#3a3a3a"
        v-else
        @click="unFollow(detailData.aut_id)"
        >已关注</van-button
      >
      <!-- 关注按钮 -->
    </div>
  </div>
</template>

<script>
import { follow, unFollow } from '@/apis/user'
import dayjs from '@/utils/dayjs'
export default {
  name: 'Title',
  data() {
    return {
      isTollow: ''
    }
  },
  props: {
    detailData: {
      type: Object,
      required: true
    }
  },
  created() {
    this.isTollow = this.detailData.is_followed
  },
  methods: {
    // 关注用户
    async followFn(id) {
      try {
        await follow(id)
        this.isTollow = true
        this.$toast.success('关注成功')
      } catch (error) {
        if (error.response.status === 401) {
          this.$toast.fail('用户登录后才可以关注')
        }
        console.log(error)
      }
    },
    // 取消关注
    async unFollow(id) {
      try {
        await unFollow(id)
        this.$toast.success('取消关注成功')
        this.isTollow = false
      } catch (error) {
        console.log(error)
      }
    }
  },
  computed: {
    time() {
      return dayjs(this.detailData.art.pubdate).fromNow()
    }
  }
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

h1 {
  font-size: 40px;
  padding: 50px 32px;
}
.user-info {
  display: flex;
  align-items: center;
  width: 100%;
  height: 84px;
  .img-div {
    display: block;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    margin-right: 20px;
    padding-left: 32px;
    img {
      height: 100%;
      width: 100%;
      border-radius: 50%;
    }
  }

  .user-info-name {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 10px 0;
    height: 100%;
    flex: 1;
    p {
      font-size: 0.32rem;
      color: #3a3a3a;
    }
    div {
      font-size: 0.30667rem;
      color: #b7b7b7;
    }
  }
  /deep/.van-button {
    margin-right: 60px;
    width: 170px;
    height: 58px;
    font-size: 14px;
    line-height: 58px;
  }
  /deep/.van-button--primary {
    border: 1px #f1f3f5 solid !important;
  }
}
</style>
