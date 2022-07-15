<template>
  <div>
    <!-- 登录头部 -->
    <van-nav-bar
      class="navBar"
      title="登录"
      left-arrow
      @click-left="onClickLeft"
    />
    <!-- 登录头部 -->
    <!-- 登陆表单 -->
    <van-form @submit="login" class="from" ref="form">
      <!-- 手机 -->
      <van-field
        v-model="mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="mobileRules"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <!-- 验证码 -->
      <van-field
        v-model="code"
        name="code"
        placeholder="请输入验证码"
        :rules="codeRules"
      >
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <van-count-down
          slot="right-icon"
          :time="3 * 1000"
          v-if="isShow"
          @finish="isShow = false"
          format="ss s"
        />
        <button slot="right-icon" class="slot-btn" v-else @click="sendCode">
          发送验证码
        </button>
      </van-field>
      <!-- 提交按钮 -->
      <div style="margin: 16px">
        <van-button block type="info" native-type="submit" class="from-btn">
          登录
        </van-button>
      </div>
    </van-form>
    <!-- 登陆表单 -->
  </div>
</template>

<script>
import { login, sendCode } from '@/apis/user'
import { mobileRules, codeRules } from './rules'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Login',
  data() {
    return {
      mobile: '',
      code: '',
      mobileRules,
      codeRules,
      isShow: false
    }
  },
  methods: {
    onClickLeft() {
      this.$router.back()
      this.$toast('返回成功')
    },
    // 登录
    async login() {
      try {
        this.$toast.loading('登陆中...')
        const { data } = await login(this.mobile, this.code)
        this.setUser(data.data)
        this.$router.push('/layout')
        this.$toast.success('登陆成功')
      } catch (e) {
        const status = e.response.status
        switch (status) {
          case 400:
            this.$toast.fail(e.response.data.message)
            break
          default:
            this.$toast.fail('登陆失败,请刷新重试')
            break
        }
      }
    },
    // 发验证码
    async sendCode(e) {
      e.preventDefault()
      try {
        // 验证手机号
        await this.$refs.form.validate('mobile')
        // 发送验证码
        await sendCode(this.mobile)
        this.isShow = true
      } catch (err) {
        if (!err.response) {
          this.$toast.fail('手机号格式不正确')
        } else {
          const status = err.response.status
          if (status === 404 || status === 429) {
            this.$toast.fail(err.response.data.message)
          }
        }
      }
    },
    ...mapMutations(['setUser'])
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style scoped lang="less">
.navBar {
  background-color: #3296fa;
  /deep/.van-nav-bar__title {
    color: #fff;
  }
  /deep/.van-icon {
    color: #fff;
  }
}
.from {
  /deep/.van-field__left-icon {
    margin-right: 25px;

    .iconfont {
      font-size: 38px;
    }
  }
  .from-btn {
    border-radius: 15px;
    border: none;
    background-color: #6db4fb;
  }
  .slot-btn {
    width: 152px;
    height: 46px;
    font-size: 22px;
    line-height: 46px;
    border: none;
    border-radius: 23px;
    background-color: #ededed;
  }
}
</style>
