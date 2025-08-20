<template>
  <div class="app-container">
    <el-card class="user-card">
      <el-form ref="listQuery" size="small" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="listQuery.search" style="width: 230px" clearable placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item>
          <div style="float: right;">
            <el-button v-if="isAdmin" icon="el-icon-plus" size="small" type="primary" @click="addUser()">新增用户</el-button>
            <el-button icon="el-icon-search" size="small" type="primary" @click="search()">查询</el-button>
            <el-button icon="el-icon-refresh" size="small" @click="refresh('listQuery')">重置</el-button>
          </div>
        </el-form-item>
      </el-form>
      <div :style="{padding:'20px 0'}">
        <el-table v-loading="listLoading" :data="lists" style="width: 100%" size="small">
          <el-table-column align="center" type="index" label="序号" min-width="60px" />
          <el-table-column align="center" prop="username" label="用户名" width="100px" />
          <el-table-column align="center" prop="name" label="姓名" width="100px" />
          <el-table-column align="center" prop="role" label="用户角色" width="120px">
            <template slot-scope="{row}">
              <el-tag
                :type="row.role === 0 ? 'success' :
                  row.role === 1 ? 'warning' : ''"
                effect="plain"
                size="small"
                disable-transitions
              >{{ row.role | roleName }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="email" label="邮箱号" width="220px" />
          <el-table-column align="center" prop="is_valid" label="是否冻结" width="120px">
            <template slot-scope="{row}">
              <el-switch
                v-model="row.is_valid"
                @change="userStateChaged(row)"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="create_time" label="创建时间" width="150px" />
          <el-table-column align="center" prop="last_login_time" label="上次登录时间" width="150px" />
          <el-table-column fixed="right" align="center" label="操作" min-width="80px">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="editUser(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getUserInfos" />
      </div>
    </el-card>
    <el-dialog
      title="编辑用户"
      width="550px"
      :visible.sync="dialogFrom"
      :close-on-click-modal="false"
      @close="cancelSubmit('updateUserForm')"
    >
      <el-form ref="updateUserForm" :inline="true" :rules="rules" :model="updateUserForm" size="small">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="updateUserForm.username" :disabled="true" style="width:120px" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="updateUserForm.role" placeholder="请选择角色类型" style="width:120px">
            <el-option
              v-for="item in role"
              :key="item.type"
              :label="item.name"
              :value="item.type"
            />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" @click="addSubmit('updateUserForm')">确定</el-button>
          <el-button type="danger" size="small" @click="cancelSubmit('updateUserForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

         <!-- 新增用户对话框 -->
     <el-dialog
       title="新增用户"
       width="450px"
       :visible.sync="addDialogVisible"
       :close-on-click-modal="false"
       @close="cancelAddUser('addUserForm')"
     >
       <el-form ref="addUserForm" :rules="addUserRules" :model="addUserForm" size="small" label-width="70px">
         <el-form-item label="用户名" prop="username">
           <el-input v-model="addUserForm.username" placeholder="请输入用户名" style="width:280px" />
         </el-form-item>
         <el-form-item label="密码" prop="password">
           <el-input v-model="addUserForm.password" type="password" placeholder="请输入密码" style="width:280px" />
         </el-form-item>
         <el-form-item label="姓名" prop="name">
           <el-input v-model="addUserForm.name" placeholder="请输入姓名" style="width:280px" />
         </el-form-item>
         <el-form-item label="邮箱" prop="email">
           <el-input v-model="addUserForm.email" placeholder="请输入邮箱" style="width:280px" />
         </el-form-item>
         <el-form-item label="角色" prop="role">
           <el-select v-model="addUserForm.role" placeholder="请选择角色类型" style="width:280px">
             <el-option
               v-for="item in role"
               :key="item.type"
               :label="item.name"
               :value="item.type"
             />
           </el-select>
         </el-form-item>
         <el-form-item>
          <div align="left" style="margin-left: 65px;">
            <el-button type="primary" size="small" @click="submitAddUser('addUserForm')">确定</el-button>
            <el-button type="danger" size="small" @click="cancelAddUser('addUserForm')">取消</el-button>
          </div>

         </el-form-item>
       </el-form>
     </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getUserList, updateUser, register, adminAddUser } from '@/api/user'

export default {
  name: 'UserIndex',
  components: { Pagination },
  filters: {
    roleName(role) {
      const roleMap = {
        0: '普通用户',
        1: '组长',
        2: '超级管理员'
      }
      return roleMap[role]
    }
  },
  props: {},
  data() {
    return {
      total: 0,
      lists: null,
      listLoading: true,
      dialogFrom: false,
      listQuery: {
        page: 1,
        limit: 20,
        search: undefined
      },
      updateUserForm: {
        id: undefined,
        username: undefined,
        is_valid: undefined,
        role: undefined
      },
      addDialogVisible: false,
      addUserForm: {
        username: '',
        password: '',
        name: '',
        email: '',
        role: 0
      },
      role: [
        {
          type: 0,
          name: '普通用户'
        },
        { type: 1,
          name: '组长'
        },
        { type: 2,
          name: '超级管理员'
        }
      ],
      rules: {
        role: [
          { required: true, message: '请选择角色类型', trigger: 'change' }
        ],
        id: [
          { required: true, message: '请输入用户id', trigger: 'blur' }
        ]
      },
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 16, message: '用户名长度在 2 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择角色类型', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    isAdmin() {
      // 从store获取用户信息，判断是否为超级管理员
      const userInfo = this.$store.getters.userInfo
      console.log('用户信息:', userInfo) // 调试信息
      const isAdmin = userInfo && userInfo.role === 2
      console.log('是否为管理员:', isAdmin) // 调试信息
      return isAdmin
    }
  },
  watch: {},
  created() {
    this.getUserInfos()
  },
  methods: {
    async getUserInfos() {
      this.listLoading = true
      await getUserList(this.listQuery).then(response => {
        this.lists = response.data.lists
        this.total = response.data.total
        this.listLoading = false
      })
    },
    async userStateChaged(row) {
      this.updateUserForm.id = row.id
      this.updateUserForm.is_valid = row.is_valid
      try {
        const { msg } = await updateUser(this.updateUserForm)
        this.$message({
          message: msg,
          type: 'success'
        })
        await this.getUserInfos()
      } catch (e) {
        await this.getUserInfos()
      }
    },
    async search() {
      await this.getUserInfos()
    },
    async refresh() {
      this.listQuery.page = 1
      this.listQuery.limit = 20
      this.listQuery.search = undefined
      await this.getUserInfos()
    },
    editUser(row) {
      this.dialogFrom = true
      this.updateUserForm.id = row.id
      this.updateUserForm.username = row.username
      this.updateUserForm.role = row.role
    },
    async edit(formName) {
      const { msg } = await updateUser(this.updateUserForm)
      this.$message({
        message: msg,
        type: 'success'
      })
      this.cancelSubmit(formName)
      await this.getUserInfos()
    },
    addSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.edit(formName)
        }
      })
    },
    cancelSubmit(formName) {
      // 等页面刷新完之后，再执行回调函数中的方法，因为this.dialogFrom = false 它是异步的
      this.$nextTick(() => {
        this.dialogFrom = false
      })
      this.$refs[formName].resetFields()
    },
    addUser() {
      this.addDialogVisible = true
      this.addUserForm = {
        username: '',
        password: '',
        name: '',
        email: '',
        role: 0
      }
    },
    async submitAddUser(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          try {
            await adminAddUser(this.addUserForm)
            this.$message({
              message: '用户添加成功',
              type: 'success'
            })
            this.cancelAddUser(formName)
            await this.getUserInfos()
          } catch (error) {
            this.$message({
              message: error.message || '用户添加失败',
              type: 'error'
            })
          }
        }
      })
    },
    cancelAddUser(formName) {
      this.$nextTick(() => {
        this.addDialogVisible = false
      })
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
.user-card {
  width: 100%;
  border-radius: 10px;
}
</style>
