<template>
  <div>
    <van-popup
      v-model="isShow"
      position="bottom"
      :style="{ height: '95%' }"
      closeable
      close-icon-position="top-left"
    >
      <div class="popupMain">
        <!-- 我的频道 -->
        <div class="my-channel">
          <van-cell title="我的频道">
            <van-button
              size="small"
              round
              class="edit-btn"
              @click="isEdit = !isEdit"
              >{{ isEdit ? '完成' : '编辑' }}</van-button
            >
          </van-cell>
          <van-grid :border="false" gutter="10px" :clickable="true">
            <van-grid-item
              icon="photo-o"
              :text="item.name"
              v-for="(item, index) in myChannel"
              :key="item.id"
              :class="{ 'active-channel': item.name === '推荐' }"
              @click="delMychannel(item, index)"
            >
              <template #icon>
                <van-icon
                  name="cross"
                  v-show="isEdit && item.name !== '推荐'"
                ></van-icon>
              </template>
            </van-grid-item>
          </van-grid>
        </div>
        <!-- 推荐频道 -->
        <div class="recommend-channel">
          <van-cell title="推荐频道"> </van-cell>
          <van-grid :border="false" gutter="10px">
            <van-grid-item
              icon="plus"
              :text="item.name"
              v-for="item in recommendChannels"
              :key="item.id"
              @click="addMyChannel(item)"
            />
          </van-grid>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getAllChannels } from '@/apis/channel'
export default {
  name: 'EditChannelPopup',
  data() {
    return {
      isShow: false,
      allChannels: [],
      isEdit: false
    }
  },
  props: {
    myChannel: {
      type: Array,
      required: true
    }
  },
  created() {
    this.getAllChannels()
  },
  methods: {
    // 获取所有频道列表
    async getAllChannels() {
      const { data } = await getAllChannels()
      this.allChannels = data.data.channels
    },
    // 删除我的频道
    delMychannel(channel, index) {
      if (this.isEdit && channel.name !== '推荐') {
        this.$emit('del-myChanel', channel)
      }
      // 不是编辑状态进行跳转
      if (!this.isEdit) {
        this.isShow = false
        this.$emit('change-active', index)
      }
    },
    addMyChannel(channel) {
      this.$emit('add-myChanel', { ...channel })
    }
  },
  computed: {
    // 把所有频道列表中没有的数据筛选出来进行渲染
    recommendChannels() {
      return this.allChannels.filter((item) => {
        return !this.myChannel.find((i) => i.id === item.id)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.active-channel {
  /deep/.van-grid-item__text {
    color: red;
  }
}
.popupMain {
  padding-top: 100px;
  .edit-btn {
    padding: 0 30px;
    height: 48px;
    color: red;
    border: 0.02667rem solid red;
  }
}
.my-channel {
  /deep/.van-grid-item__content {
    position: relative;
    background-color: #f4f5f6;
    .van-grid-item__icon-wrapper {
      position: absolute;
      top: 0;
      right: 0;
      .van-icon-cross {
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(20%, -35%);
        border: 0.02667rem solid #000;
        border-radius: 50%;
        text-align: center;
        font-size: 30px;
      }
    }
  }
}
// 推荐频道的样式
.recommend-channel {
  // 推荐频道加号样式
  :deep(.van-grid-item__content) {
    flex-direction: row;
    background-color: #f4f5f6;
    .van-grid-item__icon {
      font-size: 0.5rem;
    }

    .van-grid-item__text {
      margin-top: 0;
    }
  }
}
</style>
