<template>
  <div class="home">
    <!-- 头部导航 -->
    <van-nav-bar class="navbar">
      <template #title>
        <van-button round @click="$router.push('/search')">
          <van-icon name="search" />
          搜索
        </van-button>
      </template>
    </van-nav-bar>
    <!-- 头部导航 -->
    <!-- tabs选项卡 -->
    <van-tabs v-model="active" swipeable>
      <!-- 用户频道列表 -->
      <van-tab :title="item.name" v-for="item in myChannels" :key="item.id">
        <ArticleList :id="item.id" />
      </van-tab>

      <!-- 更多按钮 -->
      <span class="iconfont icon-gengduo" @click="showPopup"></span>
    </van-tabs>
    <!-- tabs选项卡 -->
    <!-- 弹出层 -->
    <EditChannelPopup
      ref="popup"
      :myChannel="myChannels"
      @del-myChanel="delMychannel"
      @change-active="changeActive"
      @add-myChanel="addMyChannel"
    />
    <!-- 弹出层 -->
  </div>
</template>

<script>
import {
  getMyChannels,
  getMyChannelsByLocal,
  setMyChannelToLocal,
  delMyChannel,
  addMyChannel
} from '@/apis/channel'
import ArticleList from './component/ArticleList.vue'
import EditChannelPopup from './component/EditChannelPopup.vue'
import { mapState } from 'vuex'
export default {
  name: 'Name',
  data() {
    return {
      active: 0,
      myChannels: [] // 用户频道列表
    }
  },
  async created() {
    // 获取用户频道列表
    try {
      if (!this.user.token) {
        const myChannels = getMyChannelsByLocal()
        if (myChannels) {
          this.myChannels = myChannels
        } else {
          const { data } = await getMyChannels()
          this.myChannels = data.data.channels
        }
      } else {
        const { data } = await getMyChannels()
        this.myChannels = data.data.channels
      }
    } catch (error) {}
  },
  components: {
    ArticleList,
    EditChannelPopup
  },
  methods: {
    showPopup() {
      this.$refs.popup.isShow = true
    },
    // 删除我的频道
    async delMychannel(channel) {
      this.myChannels = this.myChannels.filter((item) => item.id !== channel.id)
      if (!this.user.token) {
        // 未登录状态
        setMyChannelToLocal(this.myChannels)
      } else {
        // 登陆状态
        try {
          await delMyChannel(channel.id)
        } catch (error) {
          return this.$toast.fail('用户频道删除失败')
        }
      }
      this.$toast.success('用户频道删除成功')
    },
    // 更该索引进行跳转
    changeActive(index) {
      this.active = index
    },
    // 添加我的频道
    async addMyChannel(channel) {
      this.myChannels.push(channel)
      if (!this.user.token) {
        // 未登录状态
        setMyChannelToLocal(this.myChannels)
      } else {
        // 登陆状态
        try {
          await addMyChannel(channel.id, this.myChannels.length)
        } catch (error) {
          return this.$toast.fail('用户频道添加失败')
        }
      }
      this.$toast.success('用户频道添加成功')
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.home {
  padding-bottom: 45px;
}
// 头部导航
.navbar {
  background-color: #3296fa;
  color: #fff;
  .van-button {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
  }
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button__text {
    color: #fff;
  }
  .van-icon-search {
    color: #fff;
  }
  .van-button--default {
    border: 0.02667rem solid #5babfb;
  }
}
// 头部导航
//tabs选项卡
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.icon-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/imgs/gradient-gray-line.png');
  }
}
// 头部固定的样式
.navbar {
  position: sticky;
  top: 0;
  left: 0;
}
:deep(.van-tabs__wrap) {
  position: sticky;
  top: 92px;
  left: 0;
  z-index: 99;
}
.iconfont-gengduo {
  position: fixed;
  top: 92px;
}

:deep(.van-tabs__content) {
  max-height: calc(100vh - 92px - 82px - 100px);
  overflow: auto;
}
.iconfont {
  z-index: 999;
}
</style>
