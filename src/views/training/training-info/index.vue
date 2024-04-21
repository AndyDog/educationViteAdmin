<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  createTableDataApi,
  deleteTableDataApi,
  updateTableDataApi,
  getTableDataApi,
  upLoadImageApi,
  addImagesApi
} from "@/api/table"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

defineOptions({
  name: "ElementPlus"
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
  imageKey: "",
  imageValue: "",
  imagePath: "",
  sort: "",
  type: 1,
  userId: "",
  imageKeys: []
})
let imageUrl = ref<any>("")
const formRules: FormRules = reactive({
  imageKey: [{ required: true, trigger: "blur", message: "请输入图片KEY" }],
  imageValue: [{ required: true, trigger: "blur", message: "请输入图片名称" }],
  imagePath: [{ required: true, trigger: "change", message: "请上传图片" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addImagesApi(formData).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        let formDatatemp = JSON.parse(JSON.stringify(formData))
        formDatatemp.type = 2
        updateTableDataApi(formDatatemp).then(() => {
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
  formData.username = ""
  formData.password = ""
}
//#endregion

//#region 删
const handleDelete = (row: IGetTableData) => {
  ElMessageBox.confirm(`正在删除图片：${row.imageValue}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    let obj = {}
    obj.imageKeys = [row.imageKey]
    obj.type = 2
    deleteTableDataApi(obj).then(() => {
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
  formData.imageKey = row.imageKey
  formData.imageValue = row.imageValue
  formData.imagePath = row.imagePath

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
  username: "",
  phone: ""
})
const getTableData = () => {
  loading.value = true
  getTableDataApi({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  })
    .then((res) => {
      console.log(res)
      paginationData.total = res.data.length
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
  formData.imageKey = ""
  formData.imageValue = ""
  formData.imagePath = ""
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
  formData.imagePath = res.data
  console.log(imageUrl)
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
        <el-form-item prop="username" label="图片KEY">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="图片名称">
          <el-input v-model="searchData.phone" placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="addImage">添加</el-button>
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
          <el-table-column prop="imageKey" label="图片KEY" align="center" />
          <!-- <el-table-column prop="roles" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="imageValue" label="图片名称" align="center" />
          <el-table-column prop="imagePath" label="图片地址" align="center" />
          <el-table-column prop="updateTime" label="更新时间" align="center" />
          <el-table-column fixed="right" label="操作" width="160" align="center">
            <template #default="scope">
              <el-button type="primary" text size="small" icon="Edit" @click="handleUpdate(scope.row)">修改</el-button>
              <el-button type="danger" text size="small" icon="Delete" @click="handleDelete(scope.row)">删除</el-button>
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
      :title="currentUpdateId === undefined ? '新增图片' : '修改图片'"
      @close="resetForm"
      width="70%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="imageKey" label="图片KEY">
          <el-input v-model="formData.imageKey" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="imageValue" label="图片名称">
          <el-input v-model="formData.imageValue" placeholder="请输入" />
        </el-form-item>

        <el-form-item label="照片:" prop="imagePath">
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
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  object-fit: contain;
}
</style>

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
