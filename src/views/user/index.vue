<template>
  <div class="user">
    <!-- 头部区域 -->
    <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft" />
    <!-- 头部区域 -->
    <!-- 头像 -->
    <div class="title-img">
      <!-- 点击上传区域 -->
      <van-uploader :after-read="addFile">
        <van-cell title="头像" is-link @click="showPhoto = true">
          <div slot="default" class="head-portrait">
            <van-image
              width="30px"
              height="30px"
              fit="cover"
              :src="userInfo.photo"
              round
            />
          </div>
        </van-cell>
      </van-uploader>
      <!-- 点击上传区域 -->
      <van-popup
        v-model="showPhoto"
        position="bottom"
        :style="{ height: '95%' }"
      >
        <van-image :src="fileImg" width="10rem" height="10rem" fit="contain" />
      </van-popup>
    </div>
    <!-- 头像 -->
    <!-- 昵称 -->
    <div class="showName">
      <van-cell title="昵称" is-link @click="showName = true">
        <div slot="default">{{ userInfo.name }}</div>
      </van-cell>
      <van-popup
        v-model="showName"
        position="bottom"
        :style="{ height: '100%' }"
        @open="sliceName"
      >
        <van-nav-bar
          title="更新昵称"
          right-text="保存"
          left-arrow
          @click-left="unUpName"
          @click-right="upName"
        />
        <van-field
          v-model="nameMessage"
          autosize
          type="textarea"
          maxlength="7"
          show-word-limit
        />
      </van-popup>
    </div>
    <!-- 昵称 -->
    <!-- 性别 -->
    <div>
      <van-cell title="性别" is-link @click="showGender = true">
        <div slot="default">{{ userInfo.gender === 1 ? '女' : '男' }}</div>
      </van-cell>
      <van-popup
        v-model="showGender"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-picker
          show-toolbar
          title="更新性别"
          :columns="gender"
          @confirm="upGender"
          @cancel="unUpGender"
          :default-index="userInfo.gender"
        />
      </van-popup>
    </div>
    <!-- 性别 -->
    <!-- 生日 -->
    <div>
      <van-cell title="生日" is-link @click="showBirthday = true">
        <div slot="default">{{ userInfo.birthday }}</div>
      </van-cell>
      <van-popup
        v-model="showBirthday"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <!-- 时间 -->
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          @confirm="upBirthday"
          @cancel="unUpBirthday"
        />
      </van-popup>
    </div>
    <!-- 生日 -->
  </div>
</template>

<script>
import { getUserProfile, setUserProfile, setUserPhoto } from '@/apis/user'
import dayjs from '@/utils/dayjs'
export default {
  name: 'User',
  data() {
    return {
      minDate: new Date(1900, 0, 1),
      maxDate: new Date(),
      currentDate: '',
      userInfo: {},
      gender: [
        {
          text: '男',
          value: 0
        },
        {
          text: '女',
          value: 1
        }
      ],
      nameMessage: '',
      showGender: false,
      showName: false,
      showBirthday: false,
      showPhoto: false,
      fileList: [],
      fileImg: ''
    }
  },
  created() {
    this.getUserProfile()
  },
  methods: {
    // 上传图片调用
    async addFile(file) {
      this.fileImg = file.content
      this.showPhoto = true
      console.log(file)
      try {
        const fromData = new FormData()
        fromData.append('file', file.file)
        const res = await setUserPhoto(fromData)
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    // 获取用户个人资料
    async getUserProfile() {
      try {
        this.userInfo = (await getUserProfile()).data.data
        this.currentDate = new Date(this.userInfo.birthday)
        console.log(this.userInfo)
      } catch (error) {
        if (error.response.status === 401) {
          this.$toast.fail('用户信息认证失败,请登录重试')
        }
      }
    },
    // 更新性别
    async upGender(value) {
      try {
        // 更改更新所需书
        this.userInfo.gender = value.value
        // 发起更新请求
        await setUserProfile(this.userUpData)
        // 重新获取用户数据
        this.getUserProfile()
        // 关闭遮罩
        this.showGender = false
        this.$toast.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 更新用户名
    async upName() {
      try {
        if (!this.nameMessage.trim()) return this.$toast.fail('昵称不能为空')
        // 更改更新所需书
        this.userInfo.name = this.nameMessage
        // 发起更新请求
        await setUserProfile(this.userUpData)
        // 重新获取用户数据
        this.getUserProfile()
        this.showName = false
        this.$toast.success('更新成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 更新生日
    async upBirthday(value) {
      // 更改更新所需书
      this.userInfo.birthday = dayjs(value).format('YYYY-MM-DD')
      // 发起更新请求
      await setUserProfile(this.userUpData)
      // 重新获取用户数据
      this.getUserProfile()
      this.showBirthday = false
      this.$toast.success('更新成功')
    },
    // 取消更新生日
    unUpBirthday() {
      this.showBirthday = false
    },
    // 取消更新姓名
    unUpName() {
      this.showName = false
    },
    // 取消更新性别
    unUpGender() {
      this.showGender = false
    },
    // 返回
    onClickLeft() {
      this.$router.back()
    },
    // 每次弹出昵称修改把昵称截取成7位以内
    sliceName() {
      this.nameMessage = this.userInfo.name.slice(0, 7)
    }
  },
  computed: {
    // 用于更新用户姓名,性别,生日的数据
    userUpData() {
      const a = {}
      a.name = this.userInfo.name
      a.gender = this.userInfo.gender
      a.birthday = this.userInfo.birthday
      return a
    }
  }
}
</script>

<style lang="less" scoped>
.title-img {
  .van-popup {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #000;
  }
}
.van-uploader {
  width: 100%;
}
/deep/.van-uploader__input-wrapper {
  width: 100%;
}
//头部区域样式
/deep/.van-nav-bar__content {
  background-color: #3296fa;
  .van-nav-bar__title {
    color: #fff;
  }
}
/deep/.van-nav-bar__left {
  .van-icon {
    color: #fff;
  }
}
.user {
  background-color: #f5f7f9;
  min-height: 100vh;
}
.showName {
  .van-popup {
    /deep/.van-nav-bar__content {
      background-color: #fff;
    }
    /deep/.van-nav-bar__title {
      color: #333;
    }
    /deep/.van-icon {
      color: #1989fa;
    }
  }
}
</style>
