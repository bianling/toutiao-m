<template>
  <div class="user">
    <!-- 头部区域 -->
    <van-nav-bar title="个人信息" left-arrow @click-left="onClickLeft" />
    <!-- 头部区域 -->
    <!-- 头像 -->
    <div class="title-img">
      <!-- 点击上传区域 -->
      <van-uploader :after-read="addFile" v-model="fileList">
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
        :style="{ height: '100%' }"
      >
        <div class="fileImg-div">
          <img :src="url" class="popup-img" ref="img" />
        </div>
        <span class="unUpUserPhoto" @click="unUpUserPhoto">取消</span>
        <span class="upUserPhoto" @click="upUserPhoto">确定</span>
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
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'

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
      url: '',
      flag: true, // 节流阀
      // cropperjs配置
      myCropper: ''
    }
  },
  created() {
    this.getUserProfile()
  },
  methods: {
    // 图片插件初始化
    // 上传图片调用
    addFile() {
      // 控制弹出层图片的url路径
      this.url = this.fileList[0].content
      this.showPhoto = true
      // 初始化插件
      this.fileList = []
      if (!this.myCropper) {
        this.$nextTick(() => {
          console.log(this.$refs.img)
          this.myCropper = new Cropper(this.$refs.img, {
            viewMode: 1, // 只能在裁剪的图片范围内移动
            dragMode: 'move', // 画布和图片都可以移动
            aspectRatio: 1, // 裁剪区默认正方形
            autoCropArea: 1, // 自动调整裁剪图片
            cropBoxMovable: false, // 禁止裁剪区移动
            cropBoxResizable: false, // 禁止裁剪区缩放
            background: false // 关闭默认背景
          })
        })
      }
    },
    // 更新头像
    async upUserPhoto() {
      try {
        // 搞个节流防止图片太大多次触发
        console.log(this.myCropper)
        console.log(this.myCropper.getCroppedCanvas())
        if (this.flag) {
          this.flag = false
          // 插件的方法可以将数据使用fromData包裹上传至后端
          this.myCropper.getCroppedCanvas().toBlob(async (blob) => {
            const fromData = new FormData()
            fromData.append('photo', blob)
            await setUserPhoto(fromData)
            // 后续的提示和关闭弹窗
            this.$toast.success('更改头像成功')
            this.showPhoto = false
            this.getUserProfile()
            this.flag = true
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 获取用户个人资料
    async getUserProfile() {
      try {
        this.userInfo = (await getUserProfile()).data.data
        this.currentDate = new Date(this.userInfo.birthday)
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
    // 取消更新头像
    unUpUserPhoto() {
      this.showPhoto = false
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
.fileImg-div {
  width: 100%;
  height: 100%;
  .popup-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

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
//弹出层图片退出确认样式
.unUpUserPhoto {
  color: #fff;
  position: fixed;
  bottom: 20px;
  left: 20px;
  font-size: 30px;
}
.upUserPhoto {
  color: #fff;
  position: fixed;
  bottom: 20px;
  right: 20px;
  font-size: 30px;
}
</style>
