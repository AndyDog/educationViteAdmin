<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  createTableDataApi,
  deleteDictionaries,
  updataDictionaries,
  queryaDictionariesLike,
  upLoadImageApi,
  addDictionaries,
  queryDictionariesDetailLike,
  updateDictionariesDetail,
  deleteDictionariesDetail,
  addDictionaiesDetail
} from "@/api/table"
import { type IGetTableData } from "@/api/table/types/table"
import { type FormInstance, type FormRules, ElMessage, ElMessageBox } from "element-plus"
import { ElTable } from "element-plus"
import { Search, Refresh, CirclePlus, Delete, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import Editor from "@/components/Editor.vue"
defineOptions({
  name: "ElementPlus1"
})

const VITE_BASE_API = ref(import.meta.env.VITE_BASE_API + "user/upLoadImage")

const loading = ref<boolean>(false)
const loadingDetail = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const {
  paginationData: paginationData1,
  handleCurrentChange: handleCurrentChange1,
  handleSizeChange: handleSizeChange1
} = usePagination()
//引入组件

const dialogVisible = ref<boolean>(false)
const dialogVisibleDetail = ref<boolean>(false)

const formRef = ref<FormInstance | null>(null)
const formRefDetail = ref<FormInstance | null>(null)
const formData = reactive<any>({
  dicNumber: "", //排序号
  dictCode: "", //字典值
  dictId: "", //字典ID-修改时必填
  dictName: "", //字典名称
  dictRemark: "", //备注
  insertTime: "", //新增时间
  updateTime: "" //修改时间
})
const formDataDetail = reactive<any>({
  dicNumber: "", //排序号
  dictCode: "", //字典值
  dictId: "", //字典ID-修改时必填
  dictName: "", //字典名称
  dictRemark: "", //备注
  insertTime: "", //新增时间
  updateTime: "", //修改时间
  parentId: ""
})
const formRules: FormRules = reactive({
  dicNumber: [{ required: true, trigger: "blur", message: "请输入排序号" }],
  dictCode: [{ required: true, trigger: "blur", message: "请输入字典值" }],
  dictName: [{ required: true, trigger: "blur", message: "字典名称" }]
})
const formRulesDetail: FormRules = reactive({
  dicNumber: [{ required: true, trigger: "blur", message: "请输入排序号" }],
  dictCode: [{ required: true, trigger: "blur", message: "请输入字典值" }],
  dictName: [{ required: true, trigger: "blur", message: "字典名称" }]
})

const currentRow = ref()
const singleTableRef = ref<InstanceType<typeof ElTable>>()
const setCurrent = (row?: any) => {
  singleTableRef.value!.setCurrentRow(row)
}
const handleCurrentChangeTable = (val: any | undefined) => {
  currentRow.value = val
  getTableDataDetail()
}

const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        addDictionaries(formData).then(() => {
          ElMessage.success("新增成功")
          dialogVisible.value = false
          getTableData()
        })
      } else {
        let formDatatemp = JSON.parse(JSON.stringify(formData))
        // formDatatemp.dictId = 2
        updataDictionaries(formDatatemp).then(() => {
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

const handleCreateDetail = () => {
  formRefDetail.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateIdDetail.value === undefined) {
        // let formDatatemp = JSON.parse(JSON.stringify(formData))
        let param = {
          dicNumber: formDataDetail.dicNumber,
          dictCode: formDataDetail.dictCode,
          // "dictId": formDataDetail.dictCode,
          dictName: formDataDetail.dictName,
          dictRemark: formDataDetail.dictRemark,
          parentId: currentRow.value.dictId
        }
        addDictionaiesDetail(param).then(() => {
          ElMessage.success("新增成功")
          dialogVisibleDetail.value = false
          getTableDataDetail()
        })
      } else {
        let formDatatemp = JSON.parse(JSON.stringify(formDataDetail))
        formDatatemp.type = 2
        updateDictionariesDetail(formDatatemp).then(() => {
          ElMessage.success("修改成功")
          dialogVisibleDetail.value = false
          getTableDataDetail()
        })
      }
    } else {
      return false
    }
  })
}

const resetForm = () => {
  currentUpdateId.value = undefined

  formData.dicNumber = ""
  formData.dictCode = ""
  formData.dictId = ""
  formData.dictName = ""
  formData.dictRemark = ""
  formData.insertTime = ""
  formData.updateTime = ""
}

const resetFormDetail = () => {
  currentUpdateIdDetail.value = undefined
  // formData.code = ""
  // formData.name = ""
  formDataDetail.dicNumber = ""
  formDataDetail.dictCode = ""
  formDataDetail.dictId = ""
  formDataDetail.dictName = ""
  formDataDetail.dictRemark = ""
  formDataDetail.insertTime = ""
  formDataDetail.updateTime = ""
}

//#endregion
//#region 删
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`正在删除：${row.imageValue}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    let obj = {}
    // obj.imageKeys = [row.imageKey]
    // obj.type = 2
    deleteDictionaries(obj).then(() => {
      ElMessage.success("删除成功")
      getTableData()
    })
  })
}

const handleDeleteDetail = (row: any) => {
  ElMessageBox.confirm(`正在删除：${row.dictName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    let obj = {}
    // obj.dictCode = row.dictCode
    // obj.dictId = row.dictId
    obj.dictIds = [row.dictId]
    // obj.parentId = [row.parentId]
    // obj.type = 0

    // {
    // 	"dictCode": "",
    // 	"dictId": "",
    // 	"dictIds": [],
    // 	"keyWord": "",
    // 	"page": 0,
    // 	"parentId": "",
    // 	"size": 0,
    // 	"type": 0
    // }
    deleteDictionariesDetail(obj).then(() => {
      ElMessage.success("删除成功")
      getTableDataDetail()
    })
  })
}

//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const currentUpdateIdDetail = ref<undefined | string>(undefined)

const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id
  formData.dicNumber = row.dicNumber
  formData.dictCode = row.dictCode
  formData.dictId = row.dictId
  formData.dictName = row.dictName
  formData.dictRemark = row.dictRemark
  formData.insertTime = row.insertTime
  formData.updateTime = row.updateTime

  dialogVisible.value = true
}

const handleUpdateDetail = (row: any) => {
  currentUpdateIdDetail.value = row.id

  formDataDetail.dicNumber = row.dicNumber
  formDataDetail.dictCode = row.dictCode
  formDataDetail.dictId = row.dictId
  formDataDetail.dictName = row.dictName
  formDataDetail.dictRemark = row.dictRemark
  formDataDetail.insertTime = row.insertTime
  formDataDetail.updateTime = row.updateTime

  dialogVisibleDetail.value = true
}

//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)

const tableDataDetail = ref<IGetTableData[]>([])
const searchFormRefDetail = ref<FormInstance | null>(null)

const searchData = reactive({
  keyWord: "" //模糊匹配关键字
})

const searchDataDetail = reactive({
  keyWord: "" //模糊匹配关键字
})

const getTableData = () => {
  loading.value = true
  queryaDictionariesLike({
    currentPage: paginationData.currentPage,
    size: paginationData.pageSize
    // username: searchData.username || undefined,
    // phone: searchData.phone || undefined
  })
    .then((res: any) => {
      console.log(res)
      paginationData.total = res?.datas?.length
      tableData.value = res?.datas
      setCurrent(res?.datas?.[0])
      getTableDataDetail()
    })
    .catch(() => {
      tableData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

const getTableDataDetail = () => {
  loadingDetail.value = true
  queryDictionariesDetailLike({
    currentPage: paginationData1.currentPage,
    size: paginationData1.pageSize,
    parentCode: currentRow.value.dictCode,
    type: 1
    // ...currentRow.value
    // username: searchData.username || undefined,
    // phone: searchData.phone || undefined
  })
    .then((res: any) => {
      console.log(res)
      paginationData1.total = res?.datas?.length
      tableDataDetail.value = res?.datas
      formDataDetail.parentCode = res?.datas?.[0]?.parentId
    })
    .catch(() => {
      tableDataDetail.value = []
    })
    .finally(() => {
      loadingDetail.value = false
    })
}

const handleSearch = () => {
  if (paginationData.currentPage === 1) {
    getTableData()
  }
  paginationData.currentPage = 1
}

const handleSearchDetail = () => {
  if (paginationData1.currentPage === 1) {
    getTableData()
  }
  paginationData1.currentPage = 1
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
const handleRefreshDetail = () => {
  getTableData()
}

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })

watch([() => paginationData1.currentPage, () => paginationData1.pageSize], getTableDataDetail, { immediate: false })
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div>
          <el-card v-loading="loading" shadow="never">
            <el-form ref="searchFormRef" :inline="true" :model="searchData">
              <el-form-item prop="trainingCode">
                <div style="display: flex">
                  <el-input v-model="searchData.keyWord" placeholder="请输入关键词" />
                  <el-button style="margin-left: 10px" type="primary" :icon="Search" @click="handleSearch"
                    >查询</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
            <div class="toolbar-wrapper">
              <div>
                <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">添加</el-button>
                <el-button type="primary" bg @click="handleUpdate(currentRow)">修改</el-button>
                <el-button type="danger" :icon="Delete" @click="handleDelete(currentRow)">删除</el-button>
              </div>
            </div>
            <div class="table-wrapper">
              <el-table
                :data="tableData"
                ref="singleTableRef"
                highlight-current-row
                @current-change="handleCurrentChangeTable"
              >
                <el-table-column type="index" width="50" align="center" />
                <el-table-column prop="dictCode" label="字典值" align="center" />
                <el-table-column prop="dictName" label="字典名称" align="center">
                  <template #default="scope">
                    {{ scope.row.dictName }}
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pager-wrapper">
              <el-pagination
                background
                layout="prev, pager, next"
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
            :title="currentUpdateId === undefined ? '添加字典' : '修改字典'"
            @close="resetForm"
            width="900px"
          >
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
              <el-form-item prop="dictName" label="字典名称">
                <el-input v-model="formData.dictName" placeholder="请输入" />
              </el-form-item>
              <el-form-item prop="dictCode" label="字典值" v-if="currentUpdateId === undefined">
                <el-input v-model="formData.dictCode" placeholder="请输入" />
              </el-form-item>
              <el-form-item prop="dicNumber" label="排序号">
                <el-input-number v-model="formData.dicNumber" :min="1" :max="1000" label="排序号"></el-input-number>
              </el-form-item>
              <el-form-item prop="dictRemark" label="备注">
                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="formData.dictRemark"> </el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleCreate">确认</el-button>
            </template> </el-dialog
          >-+
        </div>
      </el-col>
      <el-col :span="16">
        <div>
          <!-- <el-card v-loading="loadingDetail" shadow="never" class="search-wrapper">
            <el-form ref="searchFormRef" :inline="true" :model="searchDataDetail">
              <el-form-item prop="trainingCode">
                <el-input v-model="searchDataDetail.keyWord" placeholder="请输入" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleSearchDetail">查询</el-button>
                <el-button type="primary" :icon="CirclePlus" @click="dialogVisibleDetail = true">添加</el-button>
                <el-button type="danger" :icon="Delete">删除</el-button>
              </el-form-item>
            </el-form>
          </el-card> -->

          <el-card v-loading="loading" shadow="never">
            <div class="toolbar-wrapper">
              <div>
                <el-form ref="searchFormRef" :inline="true" :model="searchDataDetail">
                  <el-form-item prop="trainingCode">
                    <el-input v-model="searchDataDetail.keyWord" placeholder="请输入" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" :icon="Search" @click="handleSearchDetail">查询</el-button>
                    <el-button type="primary" :icon="CirclePlus" @click="dialogVisibleDetail = true">添加</el-button>
                    <el-button type="danger" :icon="Delete">删除</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div>
                <el-tooltip content="下载">
                  <el-button type="primary" :icon="Download" circle />
                </el-tooltip>
                <el-tooltip content="刷新表格">
                  <el-button type="primary" :icon="RefreshRight" circle @click="handleRefreshDetail" />
                </el-tooltip>
              </div>
            </div>
            <div class="table-wrapper">
              <el-table :data="tableDataDetail">
                <el-table-column type="selection" width="50" align="center" />
                <el-table-column prop="parentName" label="上级字典名称" align="center" />
                <el-table-column prop="dictName" label="字典项名称" align="center">
                  <template #default="scope">
                    {{ scope.row.dictName }}
                  </template>
                </el-table-column>
                <el-table-column prop="dictCode" label="字典项值" align="center">
                  <template #default="scope">
                    {{ scope.row.dictCode }}
                  </template>
                </el-table-column>
                <el-table-column prop="dicNumber" label="排序号" align="center">
                  <template #default="scope">
                    {{ scope.row.dicNumber }}
                  </template>
                </el-table-column>
                <el-table-column prop="insertTime" label="创建时间" align="center">
                  <template #default="scope">
                    {{ scope.row.insertTime }}
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="150" align="center">
                  <template #default="scope">
                    <el-button type="primary" text bg size="small" @click="handleUpdateDetail(scope.row)"
                      >修改</el-button
                    >
                    <el-button type="danger" text bg size="small" @click="handleDeleteDetail(scope.row)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pager-wrapper">
              <el-pagination
                background
                :layout="paginationData1.layout"
                :page-sizes="paginationData1.pageSizes"
                :total="paginationData1.total"
                :page-size="paginationData1.pageSize"
                :currentPage="paginationData1.currentPage"
                @size-change="handleSizeChange1"
                @current-change="handleCurrentChange1"
              />
            </div>
          </el-card>
          <!-- 新增/修改 -->
          <el-dialog
            v-model="dialogVisibleDetail"
            :title="currentUpdateIdDetail === undefined ? '添加字典项' : '修改字典项'"
            @close="resetFormDetail"
            width="900px"
          >
            <el-form
              ref="formRefDetail"
              :model="formDataDetail"
              :rules="formRulesDetail"
              label-width="100px"
              label-position="left"
            >
              <el-form-item prop="dictName" label="字典项名称">
                <el-input v-model="formDataDetail.dictName" placeholder="请输入" />
              </el-form-item>
              <el-form-item prop="dictCode" label="字典项值">
                <el-input v-model="formDataDetail.dictCode" placeholder="请输入" />
              </el-form-item>
              <el-form-item prop="dicNumber" label="排序号">
                <el-input-number
                  v-model="formDataDetail.dicNumber"
                  :min="0"
                  :max="1000"
                  label="排序号"
                ></el-input-number>
              </el-form-item>
              <el-form-item prop="dictRemark" label="备注">
                <el-input type="textarea" :rows="3" placeholder="请输入内容" v-model="formDataDetail.dictRemark">
                </el-input>
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="dialogVisibleDetail = false">取消</el-button>
              <el-button type="primary" @click="handleCreateDetail">确认</el-button>
            </template>
          </el-dialog>
        </div>
      </el-col>
    </el-row>
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
