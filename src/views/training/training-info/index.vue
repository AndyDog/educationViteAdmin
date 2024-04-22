<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  createTableDataApi,
  deleteInfomation,
  updateInfomation,
  queryInfomationList,
  upLoadImageApi,
  addInfomation
} from "@/api/table"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import Editor from "@/components/Editor.vue"
defineOptions({
  name: "ElementPlus1"
})

const VITE_BASE_API = ref(import.meta.env.VITE_BASE_API + "user/upLoadImage")

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
//引入组件
import uploadImg from "@/components/uploadImg.vue"
import { json } from "stream/consumers"
//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  code: "",
  name: "",
  isfree: "",
  statue: "",
  pic: "",
  pic1: "",
  content: "",
  date: ""
})
let imageUrl = ref<any>("")
let imageUrl1 = ref<any>("")
const formRules: FormRules = reactive({
  imageKey: [{ required: true, trigger: "blur", message: "请输入图片KEY" }],
  imageValue: [{ required: true, trigger: "blur", message: "请输入图片名称" }],
  imagePath: [{ required: true, trigger: "change", message: "请上传图片" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addInfomation(formData).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        let formDatatemp = JSON.parse(JSON.stringify(formData))
        formDatatemp.type = 2
        updateInfomation(formDatatemp).then(() => {
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
  formData.code = ""
  formData.name = ""
}
//#endregion

//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除图片：${row.imageValue}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    let obj = {}
    // obj.imageKeys = [row.imageKey]
    // obj.type = 2
    deleteInfomation(obj).then(() => {
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
  // formData.imageKey = row.imageKey
  // formData.imageValue = row.imageValue
  // formData.imagePath = row.imagePath

  // imageKey: "",
  // imageValue: "",
  // imagePath: "",
  // sort: "",
  // type: 1,
  // userId: "",
  // imageKeys: []

  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  code: "",
  name: "",
  isfree: "",
  statue: "",
  pic: "",
  pic1: "",
  content: ""
})
const getTableData = () => {
  loading.value = true
  queryInfomationList({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize
    // username: searchData.username || undefined,
    // phone: searchData.phone || undefined
  })
    .then((res) => {
      console.log(res)
      // paginationData.total = res.data.length
      tableData.value = res.data
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

const addImage = () => {
  dialogVisible.value = true
  // formData.imageKey = ""
  // formData.imageValue = ""
  // formData.imagePath = ""
  imageUrl.value = ""
}

// 上传的图片附件
const updateFiles = (list: any) => {
  if (list.length > 0) {
    formData.pic = list
  }
}

const handleAvatarSuccess = (res: any, file: any) => {
  imageUrl.value = URL.createObjectURL(file.raw)
  formData.pic = res.data
  console.log(imageUrl)
}
const handleAvatarSuccess1 = (res: any, file: any) => {
  imageUrl1.value = URL.createObjectURL(file.raw)
  formData.pic1 = res.data
  console.log(imageUrl1)
}
// const beforeAvatarUpload = (file: any) => {
//   const isJPG = file.type === "image/jpeg"
//   const isLt2M = file.size / 1024 / 1024 < 2

//   if (!isJPG) {
//     ElMessage.error("上传头像图片只能是 JPG 格式!")
//   }
//   if (!isLt2M) {
//     ElMessage.error("上传头像图片大小不能超过 2MB!")
//   }
//   return isJPG && isLt2M
// }

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="培训代码">
          <el-input v-model="searchData.code" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="培训名称">
          <el-input v-model="searchData.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="free" label="是否免费">
          <el-select v-model="searchData.isfree" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item prop="statue" label="上架状态">
          <el-select v-model="formData.statue" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
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
          <el-table-column prop="username" label="用户名" align="center" />
          <el-table-column prop="roles" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="email" label="邮箱" align="center" />
          <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" />
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
      :title="currentUpdateId === undefined ? '培训信息' : '修改课程'"
      @close="resetForm"
      width="900px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="code" label="培训代码">
              <el-input v-model="formData.code" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item prop="name" label="培训名称" v-if="currentUpdateId === undefined">
              <el-input v-model="formData.name" placeholder="请输入" /> </el-form-item
          ></el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="培训图片:" prop="pic">
              <!-- //pic为了验证图片是必传的 -->
              <el-input v-model="formData.pic" style="height: 0px; width: 0px"></el-input>
              <!-- // :filesData="item.ufjList" 如果有回显，把获取的图片对象传给图片组件 -->
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
          <el-col :span="12">
            <el-form-item label="展示图片:" prop="pic1">
              <!-- //pic为了验证图片是必传的 -->
              <el-input v-model="formData.pic1" style="height: 0px; width: 0px"></el-input>
              <!-- // :filesData="item.ufjList" 如果有回显，把获取的图片对象传给图片组件 -->
              <!-- <upload-img @updateFileList="updateFiles"></upload-img> -->

              <el-upload
                class="avatar-uploader"
                :action="VITE_BASE_API"
                :show-file-list="false"
                :on-success="handleAvatarSuccess1"
              >
                <img v-if="imageUrl1" :src="imageUrl" class="avatar" />
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="isfree" label="是否免费">
              <el-radio-group v-model="formData.isfree">
                <el-radio value="true">是</el-radio>
                <el-radio value="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="person" label="培训时间" v-if="currentUpdateId === undefined">
              <el-date-picker
                v-model="formData.date"
                type="daterange"
                range-separator="To"
                start-placeholder="考试开始时间"
                end-placeholder="考试结束时间"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item prop="statue" label="上架状态">
          <el-radio-group v-model="formData.statue">
            <el-radio value="true">上架</el-radio>
            <el-radio value="false">下架</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="content" label="培训简介">
          <Editor v-model="formData.content"></Editor>
          <!-- <el-input v-model="formData.password" placeholder="请输入" /> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
  <!-- </div> -->
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
