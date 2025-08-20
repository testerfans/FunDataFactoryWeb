<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <!-- 用户信息显示 -->
      <div class="user-info">
        <span class="user-name">{{ userInfo.name || userInfo.username }}</span>
        <el-tag size="mini" :type="roleTagType" class="role-tag">{{ roleName }}</el-tag>
      </div>
      
      <!-- <el-tooltip effect="dark" content="点我联系作者哦~" placement="top">
        <div class="right-menu-item hover-effect">
          <svg-icon icon-class="weixin" @click="click" />
        </div>
      </el-tooltip> -->
      <el-dropdown class="avatar-container" trigger="click">
        <el-tooltip effect="dark" content="点我获取更多教程~" placement="top">
          <div class="avatar-wrapper">
            <img src="@/icons/svg/logo.png" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
        </el-tooltip>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/case/index">
            <el-dropdown-item>
              场景列表
            </el-dropdown-item>
          </router-link>
          <router-link to="/system/user">
            <el-dropdown-item>用户管理</el-dropdown-item>
          </router-link>
          <router-link to="/system/project">
            <el-dropdown-item>项目管理</el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://www.yuque.com/joker-bo9zn/hp2cg3/ultb8c">
            <el-dropdown-item>数据工厂教程</el-dropdown-item>
          </a>
          <el-dropdown-item @click.native="openChangePwdDialog">修改密码</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dialog title="修改密码" :visible.sync="pwdDialogVisible" width="420px">
        <el-form :model="pwdForm" label-width="90px" size="small">
          <el-form-item label="原密码">
            <el-input v-model="pwdForm.old_password" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="pwdForm.new_password" type="password" autocomplete="off" />
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="pwdDialogVisible=false">取 消</el-button>
          <el-button type="primary" @click="submitChangePwd">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { changePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      images: {
        weixin: require('@/icons/svg/logo.png')
      },
      pwdDialogVisible: false,
      pwdForm: {
        old_password: '',
        new_password: ''
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'userInfo'
    ]),
    roleName() {
      if (!this.userInfo) return ''
      const roleMap = {
        0: '普通用户',
        1: '组长',
        2: '超级管理员'
      }
      return roleMap[this.userInfo.role] || '未知角色'
    },
    roleTagType() {
      if (!this.userInfo) return ''
      const typeMap = {
        0: 'success',
        1: 'warning',
        2: 'danger'
      }
      return typeMap[this.userInfo.role] || 'info'
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      // 退出登录清空所有的tagsView
      await this.$store.dispatch('tagsView/delAllViews')
      // 去除重定向功能
      this.$router.push(`/login`)
    },
    openChangePwdDialog() {
      this.pwdForm.old_password = ''
      this.pwdForm.new_password = ''
      this.pwdDialogVisible = true
    },
    async submitChangePwd() {
      try {
        await changePassword(this.pwdForm)
        this.$message.success('密码修改成功，请使用新密码重新登录')
        this.pwdDialogVisible = false
        await this.logout()
      } catch (e) {}
    },
    click() {
      this.$alert('<div style="text-align: center;"><img height="400" width="325" src="/static/img.png" alt=""></div>', '联系我', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道了',
        closeOnPressEscape: true,
        closeOnClickModal: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

      .right-menu {
      float: right;
      height: 100%;
      line-height: 50px;
      display: flex;
      align-items: center;

      &:focus {
        outline: none;
      }

      .user-info {
        display: flex;
        align-items: center;
        margin-right: 20px;
        
        .user-name {
          font-size: 14px;
          color: #606266;
          margin-right: 8px;
          font-weight: 500;
        }
        
        .role-tag {
          font-size: 11px;
        }
      }

    .right-menu-item {
      display: inline-block;
      padding: 0 18px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 75px;
          height: 25px;
          border-radius: 0px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
