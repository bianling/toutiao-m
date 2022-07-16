<template>
  <div class="my">
    <!-- 头部 -->
    <header>
      <!-- 已登录 -->
      <div v-if="user.token" class="user-info banner">
        <van-row></van-row>
        <van-row class="row-2">
          <van-col span="18">
            <van-row type="flex" align="center">
              <van-image
                width="1.76rem"
                height="1.76rem"
                :src="userInfo.photo"
                cover
                round
              />
              <span class="text">{{ userInfo.name }}</span>
            </van-row>
          </van-col>
          <van-col span="6">
            <van-button class="code-btn" size="mini" round>编辑资料</van-button>
          </van-col>
        </van-row>
        <van-row>
          <van-grid class="van_grid" :border="false">
            <van-grid-item text="头条">
              <span slot="icon">{{ userInfo.art_count }}</span>
            </van-grid-item>
            <van-grid-item text="粉丝">
              <span slot="icon">{{ userInfo.fans_count }}</span>
            </van-grid-item>
            <van-grid-item text="关注">
              <span slot="icon">{{ userInfo.follow_count }}</span>
            </van-grid-item>
            <van-grid-item text="获赞">
              <span slot="icon">{{ userInfo.like_count }}</span>
            </van-grid-item>
          </van-grid>
        </van-row>
      </div>
      <!-- 未登录 -->
      <div v-else class="login-register banner">
        <div class="warp" @click="login">
          <img src="~@/assets/imgs/mobile.png" />
          <p class="text">登录/注册</p>
        </div>
      </div>
    </header>
    <!-- 头部 -->
    <!-- 主体 -->
    <main>
      <van-grid clickable :column-num="2" class="grid">
        <van-grid-item text="收藏">
          <span slot="icon" class="iconfont icon-shoucang"></span>
        </van-grid-item>
        <van-grid-item text="历史">
          <span slot="icon" class="iconfont icon-lishi"></span>
        </van-grid-item>
      </van-grid>
    </main>
    <!-- 主体 -->
    <div class="link">
      <van-cell title="消息通知" is-link></van-cell>
      <van-cell title="小智同学" is-link></van-cell>
    </div>
    <van-button v-if="user.token" block class="login-btn" @click="logout"
      >退出</van-button
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/apis/user'
export default {
  name: 'My',
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    // 退出登录
    logout() {
      this.$dialog
        .confirm({
          title: '头条',
          message: '是否退出登录?'
        })
        .then(() => {
          this.$store.commit('setUser', {})
        })
        .catch(() => {})
    },
    login() {
      this.$router.push('/login')
    },
    async getUserInfo() {
      try {
        const {
          data: { data }
        } = await getUserInfo()
        this.userInfo = data
      } catch (error) {
        this.$toast.fail('请重新登录')
      }
    }
  },
  created() {
    if (this.$store.state.user.token) {
      this.getUserInfo()
    }
  }
}
</script>

<style lang="less" scoped>
.my {
  background-color: #f5f6f7;
  height: calc(100vh - 100px);
}
.banner {
  width: 100%;
  height: 401px;
  background: url(~@/assets/imgs/banner.png) no-repeat 0 0 / cover;
}
.user-info {
  display: flex;
  flex-direction: column;
  > .van-row {
    flex: 1;
  }
  .row-2 {
    height: 100%;
    .van-image {
      margin-left: 30px;
      margin-right: 30px;
    }
    .text {
      color: #fff;
      font-size: 32px;
    }
  }
}
.code-btn {
  width: 1.53333rem;
  height: 0.42667rem;
  background: #fff;
  border-radius: 0.21333rem;
  font-size: 0.26667rem;
  color: #666;
  padding: 0;
  margin-top: 50px;
}
.code-row {
  height: 100%;
}
/deep/.van-grid-item__content {
  background-color: unset;
  color: #fff;
  font-size: 30px;
  .van-grid-item__text {
    color: #fff;
    font-size: 19px;
  }
}
.grid {
  .iconfont {
    font-size: 0.6rem;
  }
  .icon-shoucang {
    color: #ed5253;
  }
  .icon-lishi {
    color: #ffb31d;
  }
  /deep/ .van-grid-item__text {
    color: #666;
    font-size: 30px;
    margin-top: 15px;
  }
}
main {
  /deep/.van-grid-item__content {
    background-color: #fff;
  }
}
.link {
  margin: 15px 0;
}
.login-btn {
  border: none;
  /deep/.van-button__text {
    color: red;
    border: none;
  }
}
.login-register {
  display: flex;
  justify-content: center;
  align-items: center;
  .warp {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 240px;
    height: 240px;
    img {
      width: 132px;
      height: 132px;
    }
    .text {
      font-size: 30px;
      color: #fff;
    }
  }
}
</style>
