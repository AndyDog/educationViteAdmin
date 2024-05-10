<script lang="ts" setup>
import { WatchStopHandle, onMounted, reactive, ref, watch } from "vue"
import {
  getTrainingCourse,
  addTrainingCourse,
  deleteTrainingCourse,
  updateTrainingCourse,
  queryInfomationList,
  queryDictionariesDetailLike,
  queryCourseListApi
} from "@/api/table"
import {
  // createTableDataApi,
  // deleteTableDataApi,
  // updateTableDataApi,
  // getTableDataApi,
  announcementadd,
  announcementquery,
  announcementdelete,
  announcementupdate
} from "@/api/notice"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import Editor from "@/components/Editor.vue"

import type { UploadProps, UploadUserFile } from "element-plus"
const VITE_BASE_API = ref(import.meta.env.VITE_BASE_API + "user/upLoadImage")
defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
let optionsType = ref([])
//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  announcementId: "", //公告ID
  announcementids: [], //公开公告ID集合
  insertTime: "", //新增时间
  state: "", //是否置顶
  title: "", //标题
  txt: "", //内容
  dictCode: "", //通知类型1-政策文件，2-培训通知，3-资讯动态
  imgUrl: "", //图片路径
  attachUrl: "", //附件
  updateTime: "" //修改时间
})
let imageUrl = ref<any>("")
const formRules: FormRules = reactive({
  title: [{ required: true, trigger: "blur", message: "请输入标题" }],
  dictCode: [{ required: true, trigger: "blur", message: "公告类型" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        announcementadd({
          state: "0",
          title: formData.title,
          txt: formData.txt,
          dictCode: formData.dictCode,
          imgUrl: formData.imgUrl,
          attachUrl:formData.attachUrl
          // "updateTime": ""
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        announcementupdate(formData).then(() => {
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
  formData.title = ""
  formData.state = ""
  formData.txt = ""
  formData.type = ""
}
//#endregion

//#region 删
const handleDelete = (row: IGetTableData) => {
  ElMessageBox.confirm(`正在删除公开公告：${row.title}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    announcementdelete(row.id).then(() => {
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
  formData.announcementId = row.announcementId
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  dictCode: "",
  title: ""
})
const getTableData = () => {
  loading.value = true
  announcementquery({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    state: "0",
    title: searchData.title,
    // txt: formData.txt,
    dictCode: searchData.dictCode,
    type:0
  })
    .then((res) => {
      paginationData.total = res?.datas?.length
      tableData.value = res?.datas
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

// 上传的图片附件
const updateFiles = (list: any) => {
  if (list.length > 0) {
    formData.pic = list
  }
}

const handleRemove: UploadProps["onRemove"] = (file, uploadFiles) => {
  console.log(file, uploadFiles)
}

const handlePreview: UploadProps["onPreview"] = (uploadFile) => {
  console.log(uploadFile)
}

const handleExceed: UploadProps["onExceed"] = (files, uploadFiles) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  )
}
const handleAvatarSuccess = (res: any, file: any) => {
  imageUrl.value = URL.createObjectURL(file.raw)
  formData.imgUrl = res.data
}



const getTableDataDetail = () => {
  queryDictionariesDetailLike({
    page: 1,
    size: 100000,
    parentCode: "open_announcement_type", 
    type: 1
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
onMounted(() => {
  getTableDataDetail()
})
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="标题">
          <el-input v-model="searchData.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="公告类型">
          <!-- <el-input v-model="searchData.phone" placeholder="请输入" /> -->
          <el-select style="width: 200px" v-model="searchData.dictCode" placeholder="公告类型">
            <!-- <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" /> -->
            <el-option v-for="item in optionsType" :key="item.dictId" :label="item.dictName" :value="item.dictId">
            </el-option>
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增公告</el-button>
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
          <el-table-column prop="title" label="标题" align="center" />

          <el-table-column prop="dictName" label="通知类型" align="center" />
          <el-table-column prop="status" label="置顶" align="center">
            <template #default="scope">
              <el-switch v-model="scope.row.state" />
            </template>
          </el-table-column>
          <el-table-column prop="insertTime" label="创建时间" align="center" />
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
      :title="currentUpdateId === undefined ? '新增公告' : '修改公告'"
      @close="resetForm"
      width="60%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="title" label="公告标题">
          <el-input v-model="formData.title" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="type" label="公告类型">
          <!-- <el-input v-model="formData.password" placeholder="请输入" /> -->
          <el-select style="width: 200px" v-model="formData.dictCode" placeholder="公告类型">
            <!-- <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" /> -->
            <el-option v-for="item in optionsType" :key="item.dictId" :label="item.dictName" :value="item.dictId">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="txt" label="公告内容">
          <Editor v-model="formData.txt"></Editor>
          <!-- <el-input v-model="formData.password" placeholder="请输入" /> -->
        </el-form-item>

        <!-- <el-form-item label="公告图片:" prop="pic">
          <el-input v-model="formData.pic" style="height: 0px; width: 0px"></el-input>
          <upload-img @updateFileList="updateFiles"></upload-img>
        </el-form-item> -->

        <el-form-item label="公告图片:" prop="imgUrl">
          <!-- //pic为了验证图片是必传的 -->
          <el-input v-model="formData.imgUrl" style="height: 0px; width: 0px; visibility: hidden"></el-input>
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

        <el-form-item label="公告附件:" prop="attachUrl">
          <el-upload
            v-model="formData.attachUrl"
            class="upload-demo"
            multiple
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :limit="3"
            :on-exceed="handleExceed"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">文件不超过100M</div>
            </template>
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
