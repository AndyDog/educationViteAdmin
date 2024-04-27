<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  createTableDataApi,
  deleteTableDataApi,
  updateTableDataApi,
  queryCourseListApi,
  addCourse,
  updateCourse,
  deleteCourse
} from "@/api/table"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import uploadImg from "@/components/uploadImg.vue"
import Editor from "@/components/Editor.vue"
defineOptions({
  name: "ElementPlus"
})

const VITE_BASE_API = ref(import.meta.env.VITE_BASE_API + "user/upLoadImage")

// 课程管理
const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  courseClassify: "", //课程分类
  courseCode: "", //课程代码
  courseId: "", //课程ID
  courseImagePath: "", //课程图片路径
  courseIntroduce: "", //课程简介
  courseName: "", //课程名称
  dictCode: "", //分类ID
  insertTime: "", //插入时间
  lecturer: "", //主讲老师
  updateTime: "" //更新时间
})
let imageUrl = ref<any>("")
const formRules: FormRules = reactive({
  username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
  password: [{ required: true, trigger: "blur", message: "请输入密码" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      console.log(formData)
      if (currentUpdateId.value === undefined) {
        addCourse(formData).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateCourse(formData).then(() => {
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
  formData.courseClassify = ""
  formData.courseCode = ""
  formData.courseId = ""
  formData.courseImagePath = ""
  formData.courseIntroduce = ""
  formData.courseName = ""
  formData.dictCode = ""
  formData.insertTime = ""
  formData.lecturer = ""
  formData.updateTime = ""
}
//#endregion

//#region 删
const handleDelete = (row: IGetTableData) => {
  ElMessageBox.confirm(`正在删除用户：${row.username}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCourse(row.id).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  // currentUpdateId.value = undefined
  formData.courseClassify = row?.courseClassify
  formData.courseCode = row.courseCode
  formData.courseId = row.courseId
  formData.courseImagePath = row.courseImagePath
  formData.courseIntroduce = row.courseIntroduce
  formData.courseName = row.courseName
  formData.dictCode = row.dictCode
  formData.insertTime = row.insertTime
  formData.lecturer = row.lecturer
  formData.updateTime = row.updateTime
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
  queryCourseListApi({
    courseIds: [],
    page: paginationData.currentPage,
    size: paginationData.pageSize
  })
    .then((res: any) => {
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

const handleAvatarSuccess = (res: any, file: any) => {
  imageUrl.value = URL.createObjectURL(file.raw)
  formData.courseImagePath = res.data
  console.log(imageUrl)
}

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="课程代码">
          <el-input v-model="searchData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="课程名称">
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">添加</el-button>
          <el-button type="danger" :icon="Delete">删除</el-button>
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
          <el-table-column prop="courseCode" label="课程代码" align="center" />
          <!-- <el-table-column prop="roles" label="角色" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.roles === 'admin'" effect="plain">admin</el-tag>
              <el-tag v-else type="warning" effect="plain">{{ scope.row.roles }}</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="courseName" label="课程名称" align="center" />
          <el-table-column prop="courseClassify" label="课程分类" align="center" />
          <el-table-column prop="updateTime" label="更新时间" align="center" />
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
      :title="currentUpdateId === undefined ? '新增课程' : '修改课程'"
      @close="resetForm"
      width="900px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="courseCode" label="课程代码">
              <el-input v-model="formData.courseCode" placeholder="请输入" /> </el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item prop="courseName" label="课程名称">
              <el-input v-model="formData.courseName" placeholder="请输入" /> </el-form-item
          ></el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item prop="courseClassify" label="课程分类">
              <el-select v-model="formData.courseClassify" placeholder="课程分类">
                <el-option label="理论知识" value="理论知识" />
                <el-option label="技能训练" value="技能训练" /> </el-select></el-form-item
          ></el-col>
          <el-col :span="12">
            <el-form-item prop="lecturer" label="主讲老师">
              <el-select v-model="formData.lecturer" placeholder="Activity zone">
                <el-option label="Zone one" value="shanghai" />
                <el-option label="Zone two" value="beijing" />
              </el-select> </el-form-item
          ></el-col>
        </el-row>

        <el-form-item label="课程图片:" prop="pic">
          <!-- //pic为了验证图片是必传的 -->
          <el-input v-model="formData.courseImagePath" style="height: 0px; width: 0px; visibility: hidden"></el-input>
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

        <el-form-item prop="courseIntroduce" label="课程简介">
          <Editor v-model="formData.courseIntroduce"></Editor>
          <!-- <el-input v-model="formData.password" placeholder="请输入" /> -->
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
