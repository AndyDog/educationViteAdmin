<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import { useraddUser, usergetByUserLike, userdeleteUser, userupdateUser, usergetRole } from "@/api/user"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import uploadImg from "@/components/uploadImg.vue"
defineOptions({
  name: "ElementPlus"
})
const VITE_BASE_API = ref(import.meta.env.VITE_BASE_API + "user/upLoadImage")
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
let optionsType = ref([])
//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  birthday: "",
  email: "",
  gender: "",
  id: 0,
  idCard: "",
  imagePath: "",
  insertTime: "",
  intro: "",
  loginName: "",
  password: "",
  phone: "",
  roleIds: "",
  status: "",
  updateTime: "",
  // userId: "",
  userName: "",
  userRoleList: []
})

let imageUrl = ref<any>("")

const formRules: FormRules = reactive({
  loginName: [{ required: true, trigger: "blur", message: "请输入账号" }],
  userName: [{ required: true, trigger: "blur", message: "请输入姓名" }],
  userRoleList: [{ required: true, trigger: "blur", message: "请输入角色" }]
  // password: [{ required: true, trigger: "blur", message: "请输入登陆密码" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      let param = JSON.parse(JSON.stringify(formData))
      //
      param.userRoleList = param.userRoleList.map((item) => {
        let obj = {}
        obj = optionsType.value.filter((itemm) => {
          return itemm.roleCode == item
        })[0]
        return obj
      })

      if (currentUpdateId.value === undefined) {
        useraddUser(param).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        userupdateUser(formData).then(() => {
          ElMessage.success("修改成功")
          dialogVisible.value = false
          getTableData()
        })
      }
    } else {
      return false
    }
  })
}
const resetForm = () => {
  currentUpdateId.value = undefined
  formData.birthday = ""
  formData.email = ""
  formData.gender = ""
  formData.id = 0
  formData.imagePath = ""
  formData.insertTime = ""
  formData.intro = ""
  formData.loginName = ""
  formData.password = ""

  formData.phone = ""
  formData.roleIds = ""
  formData.status = ""
  formData.updateTime = ""
  // formData.userId = ""
  formData.userName = ""
  formData.userRoleList = []
}
//#endregion

//#region 删
const handleDelete = (row: IGetTableData) => {
  ElMessageBox.confirm(`正在删除用户：${row.userName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    userdeleteUser(row.userId).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: IGetTableData) => {
  currentUpdateId.value = row.id
  formData.userName = row.userName
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  loginName: "",
  userName: "",
  phone: "",
  idCard: "",
  gender: ""
})

const getTableData = () => {
  loading.value = true
  usergetByUserLike({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    loginName: searchData.loginName || undefined,
    userName: searchData.userName || undefined,
    phone: searchData.phone || undefined,
    idCard: searchData.idCard || undefined,
    gender: searchData.gender || undefined
  })
    .then((res) => {
      paginationData.total = res?.datas?.length
      // tableData.value = res?.datas
      let result = res?.datas
      tableData.value = result.map((item) => {
        let obj = item
        obj.statusFilter = obj.status == 1 ? true : false
        return obj
      })
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}
const handleRefresh = () => {
  getTableData()
}

const handleAvatarSuccess = (res: any, file: any) => {
  imageUrl.value = URL.createObjectURL(file.raw)
  formData.imagePath = res.data
  console.log(imageUrl)
}
const getTableDataDetail = () => {
  usergetRole({
    page: 1,
    size: 100000
    // parentCode: "course_classification",
    // type: 1
    // username: searchData.username || undefined,
    // phone: searchData.phone || undefined
  })
    .then((res: any) => {
      console.log(res)
      optionsType.value = res?.datas
    })
    .catch(() => {
      optionsType.value = []
    })
}
//#endregion
onMounted(() => {
  // 初始化执行的事件

  getTableDataDetail()
})
/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="loginName" label="账号">
          <el-input v-model="searchData.loginName" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item prop="phone" label="用户类型">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item prop="userName" label="姓名">
          <el-input v-model="searchData.userName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="手机号">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="性别">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item prop="phone" label="出生年月">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item> -->
        <!-- <el-form-item prop="phone" label="角色">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item prop=" idCard" label="身份证号">
          <el-input v-model="searchData.idCard" placeholder="请输入" />
        </el-form-item>
        <!-- <el-form-item prop="phone" label="机构">
          <el-input v-model="searchData.phone" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增用户</el-button>
          <el-button type="danger" :icon="Delete">批量删除</el-button>
        </div>
        <div>
          <el-tooltip content="下载">
            <el-button type="primary" :icon="Download" circle />
          </el-tooltip>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="tableData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop=" loginName" label="账号" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="userName" label="姓名" align="center" />
          <el-table-column prop="idCard" label="身份证号" align="center" />
          <el-table-column prop="createTime" label="角色" align="center">
            <template #default="scope">
              <div v-if="scope.row.userRoleList && scope.row.userRoleList.length > 0">
                <el-tag effect="plain" v-for="item in scope.row.userRoleList">{{ item.roleName }}</el-tag>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="机构" align="center" />
          <el-table-column prop="createTime" label="分组" align="center" />

          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-switch v-model="scope.row.statusFilter" />
              <!-- <el-switch v-else v-model="scope.row.status" /> -->
              <!-- <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag> -->
            </template>
          </el-table-column>
          <!--
          <el-table-column prop="status" label="性别" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="出生年月" align="center" /> -->

          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="primary" text bg size="small" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pager-wrapper">
        <el-pagination
          background
          :layout="paginationData.layout"
          :page-sizes="paginationData.pageSizes"
          :total="paginationData.total"
          :page-size="paginationData.pageSize"
          :currentPage="paginationData.currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '用户信息' : '修改'"
      @close="resetForm"
      width="900px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="loginName" label="账号">
              <el-input v-model="formData.loginName" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item prop="userName" label="姓名">
              <el-input v-model="formData.userName" placeholder="请输入" /> </el-form-item
          ></el-col>
          <!-- <el-col :span="12">
            <el-form-item prop="name" label="用户类型" v-if="currentUpdateId === undefined">
              <el-input v-model="formData.password" placeholder="请输入" /> </el-form-item
          ></el-col> -->
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="phone" label="手机号" v-if="currentUpdateId === undefined">
              <el-input v-model="formData.phone" placeholder="请输入" /> </el-form-item
          ></el-col>

          <el-col :span="12">
            <el-form-item prop="password" label="登录密码" v-if="currentUpdateId === undefined">
              <el-input v-model="formData.password" placeholder="请输入" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="gender" label="性别">
              <el-select v-model="formData.gender" placeholder="性别" clearable>
                <el-option label="男" value="1" />
                <el-option label="女" value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="birthday" label="出生日期">
              <!-- <el-input v-model="formData.password" placeholder="请输入" />  -->
              <el-date-picker
                v-model="formData.birthday"
                type="date"
                placeholder="出生日期"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="userRoleList" label="角色">
              <el-select v-model="formData.userRoleList" placeholder="角色" multiple clearable>
                <el-option
                  v-for="item in optionsType"
                  :key="item.roleCode"
                  :label="item.roleName"
                  :value="item.roleCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="idCard" label="身份证号" v-if="currentUpdateId === undefined">
              <!-- <el-date-picker
                v-model="formData.date"
                type="daterange"
                range-separator="To"
                start-placeholder="考试开始时间"
                end-placeholder="考试结束时间"
              /> -->
              <el-input v-model="formData.idCard" placeholder="请输入" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item prop="code" label="机构">
              <el-input v-model="formData.username" placeholder="请输入" /> </el-form-item
          ></el-col> -->
        </el-row>

        <el-row :gutter="20">
          <!-- <el-col :span="12">
            <el-form-item prop="statue" label="分组">
              <el-radio-group v-model="formData.isfree">
                <el-radio value="true">上架</el-radio>
                <el-radio value="false">下架</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="用户头像:" prop="imagePath">
              <!-- //pic为了验证图片是必传的 -->
              <el-input v-model="formData.imagePath" style="height: 0px; width: 0px; visibility: hidden"></el-input>
              <!-- <upload-img @updateFileList="updateFiles"></upload-img> -->

              <el-upload
                class="avatar-uploader"
                :action="VITE_BASE_API"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
              >
                <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
                <el-icon v-else class="avatar-uploader-icon">
                  <Plus />
                </el-icon>
                <!-- <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="个人简介">
          <el-input v-model="formData.intro" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.search-wrapper {
  margin-bottom: 20px;
  :deep(.el-card__body) {
    padding-bottom: 2px;
  }
}

.toolbar-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-wrapper {
  margin-bottom: 20px;
}

.pager-wrapper {
  display: flex;
  justify-content: flex-end;
}
</style>
