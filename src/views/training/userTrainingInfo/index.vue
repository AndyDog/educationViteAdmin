<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue"
import {
  createTableDataApi,
  deleteTableDataApi,
  updateTableDataApi,
  getTableDataApi,
  queryInfomationList,
  getUserTraining,
  addUserTraining,
  deleteUserTraining,
  updateUserTraining
} from "@/api/table"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"

defineOptions({
  name: "ElementPlus"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()

//#region 增
const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive({
  userTrainingId: "",
  userId: "",
  itemId: ""
})
const formRules: FormRules = reactive({
  userTrainingId: [{ required: true, trigger: "blur", message: "请选择用户" }],
  userId: [{ required: true, trigger: "blur", message: "请选择培训信息" }]
})

let optionstraining = ref([])

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addUserTraining({
          userTrainingId: formData.userTrainingId,
          userId: formData.userId
        }).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        updateUserTraining({
          id: currentUpdateId.value,
          userTrainingId: formData.userTrainingId,
          userId: formData.userId
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
  formData.userTrainingId = ""
  formData.userId = ""
}
//#endregion

//#region 删
const handleDelete = (row: IGetTableData) => {
  ElMessageBox.confirm(`正在删除：${row.itemName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteTableDataApi(row.id).then(() => {
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
  formData.userTrainingId = row.userTrainingId
  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  userTrainingId: "",
  userId: ""
})
const getTableData = () => {
  loading.value = true
  getUserTraining({
    page: paginationData.currentPage,
    size: paginationData.pageSize,
    userId: formData.userId || undefined,
    userTrainingId: formData.userTrainingId || undefined
  })
    .then((res) => {
      // paginationData.total = res.data.total
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

// 获取培训信息下拉列表
const getqueryInfomationList = () => {
  // loading.value = true
  queryInfomationList({
    currentPage: 1,
    size: 99999
  }).then((res: any) => {
    console.log(res)
    optionstraining.value = res?.datas
    console.log(optionstraining)
  })
}

//#endregion
onMounted(() => {
  getqueryInfomationList()
  // getTableData()
})

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="trainingId" label="培训">
          <el-select style="width: 150px" v-model="searchData.itemId" placeholder="请选择">
            <div class="customselect">
              <el-row :gutter="20">
                <el-col :span="12"> <span>培训代码</span></el-col>
                <el-col :span="12"> <span>培训名称</span></el-col>
              </el-row>
            </div>
            <el-option
              v-for="item in optionstraining"
              :key="item.trainingCode"
              :label="item.trainingName"
              :value="item.trainingCode"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <span>{{ item.trainingCode }}</span></el-col
                >
                <el-col :span="12">
                  <span> {{ item.trainingName }}</span></el-col
                >
              </el-row>
            </el-option>
          </el-select>

          <!-- <SelectTable v-model:data="searchData.trainingId" :fields="fields" :tableData="optionstraining" :label="label"
            :objKey="objKey" :border="true"></SelectTable> -->
        </el-form-item>
        <el-form-item prop="phone" label="用户">
          <el-input v-model="searchData.userId" placeholder="请输入" />
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
          <el-table-column prop="userName" label="用户" align="center" />
          <el-table-column prop="itemName" label="培训" align="center" />
          <el-table-column prop="updataTime" label="更新时间" align="center" />
          <el-table-column label="操作" align="center">
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
        <el-form-item prop="username" label="培训">
          <el-select v-model="formData.itemId" placeholder="请选择">
            <div class="customselect">
              <el-row :gutter="20">
                <el-col :span="12"> <span>培训代码</span></el-col>
                <el-col :span="12"> <span>培训名称</span></el-col>
              </el-row>
            </div>
            <el-option
              v-for="item in optionstraining"
              :key="item.trainingCode"
              :label="item.trainingName"
              :value="item.trainingCode"
            >
              <el-row :gutter="20">
                <el-col :span="12">
                  <span>{{ item.trainingCode }}</span></el-col
                >
                <el-col :span="12">
                  <span> {{ item.trainingName }}</span></el-col
                >
              </el-row>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="password" label="用户">
          <el-select v-model="formData.password" placeholder="Activity zone">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
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
