<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getTrainingCourse, addTrainingCourse, deleteTrainingCourse, updateTrainingCourse } from "@/api/table"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
//培训课程信息
defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  courseId: "", //课程id
  dictCode: "", //分类id
  examRatio: "", //考试成绩占比
  insertTime: "", //插入时间
  isDrag: "", //允许拖动,1-是,2-否
  isMajor: "", //是否必修,1-是,2-否,
  itemId: "", //培训信息ID
  manager: "", //负责人
  scoreRatio: "", //学习成绩占比
  trainingCourseId: "", //培训课程信息ID
  updateTime: "" //更新时间
})
const formRules: FormRules = reactive({
  itemId: [{ required: true, trigger: "blur", message: "" }],
  dictCode: [{ required: true, trigger: "blur", message: "" }],
  courseId: [{ required: true, trigger: "blur", message: "" }],
  isDrag: [{ required: true, trigger: "blur", message: "" }],
  isMajor: [{ required: true, trigger: "blur", message: "" }],
  scoreRatio: [{ required: true, trigger: "blur", message: "" }],
  examRatio: [{ required: true, trigger: "blur", message: "" }]
})

const options = reactive([
  {
    value: "选项1",
    label: "黄金糕"
  },
  {
    value: "选项2",
    label: "双皮奶"
  },
  {
    value: "选项3",
    label: "蚵仔煎"
  },
  {
    value: "选项4",
    label: "龙须面"
  },
  {
    value: "选项5",
    label: "北京烤鸭"
  }
])

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addTrainingCourse({
          username: formData.username,
          password: formData.password
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateTrainingCourse({
          id: currentUpdateId.value,
          username: formData.username
        }).then(() => {
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
  formData.courseId = ""
  formData.dictCode = ""
  formData.examRatio = ""
  formData.insertTime = ""
  formData.isDrag = ""
  formData.isMajor = ""
  formData.itemId = ""
  formData.manager = ""
  formData.scoreRatio = ""
  formData.trainingCourseId = ""
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
    deleteTrainingCourse(row.id).then(() => {
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
  // formData.username = row.username
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  courseId: "", //课程id
  dictCode: "", //分类id
  examRatio: "", //考试成绩占比
  insertTime: "", //插入时间
  isDrag: "", //允许拖动,1-是,2-否
  isMajor: "", //是否必修,1-是,2-否,
  itemId: "", //培训信息ID
  manager: "", //负责人
  scoreRatio: "", //学习成绩占比
  trainingCourseId: "", //培训课程信息ID
  updateTime: "" //更新时间
})
const getTableData = () => {
  loading.value = true
  getTrainingCourse({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize,
    username: searchData.username || undefined,
    phone: searchData.phone || undefined
  })
    .then((res) => {
      paginationData.total = res.data.total
      tableData.value = res.data.list
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
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="培训">
          <el-select style="width: 150px" v-model="searchData.itemId" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="phone" label="分类">
          <el-select style="width: 150px" v-model="searchData.dictCode" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="phone" label="课程">
          <el-select style="width: 150px" v-model="searchData.courseId" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
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
          <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">新增</el-button>
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
          <el-table-column prop="itemId" label="培训" align="center" />

          <el-table-column prop=" courseId" label="课程" align="center" />
          <el-table-column prop="dictCode" label="分类" align="center" />
          <!-- <el-table-column prop="status" label="状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.status" type="success" effect="plain">启用</el-tag>
              <el-tag v-else type="danger" effect="plain">禁用</el-tag>
            </template>
          </el-table-column> -->
          <el-table-column prop="manager" label="负责人" align="center" />
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
      :title="currentUpdateId === undefined ? '添加专业课程' : '修改专业课程'"
      @close="resetForm"
      width="600px"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="140px" label-position="left">
        <el-form-item prop="itemId" label="培训">
          <el-select v-model="formData.itemId" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item prop="dictCode" label="分类">
          <el-select v-model="formData.dictCode" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>

        <el-form-item prop="courseId" label="课程">
          <el-select v-model="formData.courseId" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>

        <el-form-item prop="manager" label="负责人">
          <el-select v-model="formData.manager" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>

        <el-form-item prop="isMajor" label="是否必修">
          <el-radio-group v-model="formData.isMajor">
            <el-radio value="true">是</el-radio>
            <el-radio value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="isDrag" label="允许拖动">
          <el-radio-group v-model="formData.isDrag">
            <el-radio value="true">是</el-radio>
            <el-radio value="false">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="scoreRatio" label="学习成绩占比">
          <el-input-number v-model="formData.scoreRatio" :min="1" :max="100" />
        </el-form-item>

        <el-form-item prop="examRatio" label="考试成绩占比">
          <el-input-number v-model="formData.examRatio" :min="1" :max="100" />
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
