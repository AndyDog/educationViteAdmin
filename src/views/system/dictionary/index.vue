<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import {
  createTableDataApi,
  deleteInfomation,
  updateInfomation,
  queryaDictionariesLike,
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

const dialogVisible = ref<boolean>(false)
const formRef = ref<FormInstance | null>(null)
const formData = reactive<any>({
  introduction: "", //简介
  date: "", //时间（数组 需要拆分成开始时间和结束时间）
  beginDate: "", //开始时间
  endDate: "", //结束时间
  studyHours: "", //要求学时
  insertTime: "", //插入时间
  isFree: "", //是否免费
  trainingCode: "", //培训信息代码
  trainingId: "", //培训信息ID
  imagePath: "", //培训图片
  trainingName: "", //培训名称
  price: "", //培训价格
  showImage: "", //展示图片
  status: "", //上架状态
  studyHoursLength: "", //学习时长
  updateTime: "" //更新时间
})
let imageUrl = ref<any>("")
let imageUrl1 = ref<any>("")
const formRules: FormRules = reactive({
  trainingName: [{ required: true, trigger: "blur", message: "请输入培训名称" }],
  isFree: [{ required: true, trigger: "change", message: "请选择是否免费" }],
  status: [{ required: true, trigger: "change", message: "请选择上架状态" }],
  studyHours: [{ required: true, trigger: "blur", message: "请选择要求学时" }],
  studyHoursLength: [{ required: true, trigger: "blur", message: "请选择学习时长" }]
})
const handleCreate = () => {
  formRef.value?.validate((valid: boolean) => {
    if (valid) {
      if (currentUpdateId.value === undefined) {
        formData.beginDate = formData.date.length > 0 && formData.date[0]
        formData.endDate = formData.date.length > 0 && formData.date[1]

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
  // formData.code = ""
  // formData.name = ""
  formData.introduction = ""
  formData.date = ""
  formData.beginDate = ""
  formData.endDate = ""
  formData.studyHours = ""
  formData.insertTime = ""
  formData.isFree = ""
  formData.trainingCode = ""
  formData.imagePath = ""
  formData.trainingName = ""
  formData.price = ""
  formData.showImage = ""
  formData.status = ""
  formData.studyHoursLength = ""
  formData.updateTime = ""
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
const handleUpdate = (row: any) => {
  currentUpdateId.value = row.id

  formData.introduction = row.introduction
  formData.date = [row.beginDate, row.endDate]
  formData.beginDate = row.beginDate
  formData.endDate = row.endDate
  formData.studyHours = row.studyHours
  formData.insertTime = row.insertTime
  formData.isFree = row.isFree
  formData.trainingCode = row.trainingCode
  formData.imagePath = row.imagePath
  formData.trainingName = row.trainingName
  formData.price = row.price
  formData.showImage = row.showImage
  formData.status = row.status
  formData.studyHoursLength = row.studyHoursLength
  formData.updateTime = row.updateTime

  dialogVisible.value = true
}
//#endregion

//#region 查
const tableData = ref<IGetTableData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  introduction: "", //简介
  date: "", //时间（数组 需要拆分成开始时间和结束时间）
  beginDate: "", //开始时间
  endDate: "", //结束时间
  studyHours: "", //要求学时
  insertTime: "", //插入时间
  isFree: "", //是否免费
  trainingCode: "", //培训信息代码
  imagePath: "", //培训图片
  trainingName: "", //培训名称
  price: "", //培训价格
  showImage: "", //展示图片
  status: "", //上架状态
  studyHoursLength: "", //学习时长
  updateTime: "" //更新时间
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
  formData.imagePath = res.data
  console.log(imageUrl)
}
const handleAvatarSuccess1 = (res: any, file: any) => {
  imageUrl1.value = URL.createObjectURL(file.raw)
  formData.showImage = res.data
  console.log(imageUrl1)
}

//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.currentPage, () => paginationData.pageSize], getTableData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8">
        <div>
          <el-card v-loading="loading" shadow="never" class="search-wrapper">
            <el-form ref="searchFormRef" :inline="true" :model="searchData">
              <el-form-item prop="trainingCode" label="请输入关键词">
                <el-input v-model="searchData.trainingCode" placeholder="请输入" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card v-loading="loading" shadow="never">
            <div class="toolbar-wrapper">
              <div>
                <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">添加</el-button>
                <el-button type="primary" bg @click="handleUpdate(row)">修改</el-button>
                <el-button type="danger" :icon="Delete">删除</el-button>
              </div>
            </div>
            <div class="table-wrapper">
              <el-table :data="tableData">
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
            :title="currentUpdateId === undefined ? '培训信息' : '修改课程'"
            @close="resetForm"
            width="900px"
          >
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item prop="trainingCode" label="培训代码">
                    <el-input v-model="formData.trainingCode" placeholder="请输入" /> </el-form-item
                ></el-col>
                <el-col :span="12">
                  <el-form-item prop="trainingName" label="培训名称" v-if="currentUpdateId === undefined">
                    <el-input v-model="formData.trainingName" placeholder="请输入" /> </el-form-item
                ></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="培训图片:" prop="pic">
                    <!-- //pic为了验证图片是必传的 -->
                    <el-input
                      v-model="formData.imagePath"
                      style="height: 0px; width: 0px; visibility: hidden"
                    ></el-input>
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
                    <el-input
                      v-model="formData.showImage"
                      style="height: 0px; width: 0px; visibility: hidden"
                    ></el-input>
                    <!-- // :filesData="item.ufjList" 如果有回显，把获取的图片对象传给图片组件 -->
                    <!-- <upload-img @updateFileList="updateFiles"></upload-img> -->

                    <el-upload
                      class="avatar-uploader"
                      :action="VITE_BASE_API"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess1"
                    >
                      <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
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
                  <el-form-item prop="isFree" label="是否免费">
                    <el-radio-group v-model="formData.isFree">
                      <el-radio value="1">是</el-radio>
                      <el-radio value="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="date" label="培训时间">
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
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item prop="status" label="上架状态">
                    <el-radio-group v-model="formData.status">
                      <el-radio value="1">上架</el-radio>
                      <el-radio value="2">下架</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="studyHours" label="要求学时">
                    <el-input-number
                      v-model="formData.studyHours"
                      :min="1"
                      :max="1000"
                      label="要求学时"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item prop="studyHoursLength" label="学时长度(秒):">
                <el-input-number
                  v-model="formData.studyHoursLength"
                  :min="1"
                  :max="1000"
                  label="学时长度"
                ></el-input-number>
              </el-form-item>
              <el-form-item prop="introduction" label="培训简介">
                <Editor v-model="formData.introduction"></Editor>
                <!-- <el-input v-model="formData.password" placeholder="请输入" /> -->
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleCreate">确认</el-button>
            </template>
          </el-dialog>
        </div>
      </el-col>
      <el-col :span="16">
        <div>
          <el-card v-loading="loading" shadow="never" class="search-wrapper">
            <el-form ref="searchFormRef" :inline="true" :model="searchData">
              <el-form-item prop="trainingCode" label="请输入关键词">
                <el-input v-model="searchData.trainingCode" placeholder="请输入" />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>

                <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">添加</el-button>
                <el-button type="danger" :icon="Delete">删除</el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <el-card v-loading="loading" shadow="never">
            <div class="toolbar-wrapper">
              <div>
                <el-button type="primary" :icon="CirclePlus" @click="dialogVisible = true">添加</el-button>
                <!-- <el-button type="danger" :icon="Delete">批量删除</el-button> -->
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
                <el-table-column prop="trainingCode" label="培训代码" align="center" />
                <el-table-column prop="trainingName" label="培训名称" align="center">
                  <template #default="scope">
                    {{ scope.row.trainingName }}
                  </template>
                </el-table-column>
                <el-table-column prop="isFree" label="是否免费" align="center">
                  <template #default="scope">
                    <el-tag v-if="scope.row.isFree == 1" type="success" effect="plain">是</el-tag>
                    <el-tag v-else type="danger" effect="plain">否</el-tag>
                  </template>
                </el-table-column>
                <el-table-column prop="createTime" label="上架状态" align="center">
                  <template #default="scope">
                    <el-tag v-if="scope.row.status == 1" type="success" effect="plain">已上架</el-tag>
                    <el-tag v-else type="danger" effect="plain">未上架</el-tag>
                  </template>
                </el-table-column>
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
                  <el-form-item prop="trainingCode" label="培训代码">
                    <el-input v-model="formData.trainingCode" placeholder="请输入" /> </el-form-item
                ></el-col>
                <el-col :span="12">
                  <el-form-item prop="trainingName" label="培训名称" v-if="currentUpdateId === undefined">
                    <el-input v-model="formData.trainingName" placeholder="请输入" /> </el-form-item
                ></el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="培训图片:" prop="pic">
                    <!-- //pic为了验证图片是必传的 -->
                    <el-input
                      v-model="formData.imagePath"
                      style="height: 0px; width: 0px; visibility: hidden"
                    ></el-input>
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
                    <el-input
                      v-model="formData.showImage"
                      style="height: 0px; width: 0px; visibility: hidden"
                    ></el-input>
                    <!-- // :filesData="item.ufjList" 如果有回显，把获取的图片对象传给图片组件 -->
                    <!-- <upload-img @updateFileList="updateFiles"></upload-img> -->

                    <el-upload
                      class="avatar-uploader"
                      :action="VITE_BASE_API"
                      :show-file-list="false"
                      :on-success="handleAvatarSuccess1"
                    >
                      <img v-if="imageUrl1" :src="imageUrl1" class="avatar" />
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
                  <el-form-item prop="isFree" label="是否免费">
                    <el-radio-group v-model="formData.isFree">
                      <el-radio value="1">是</el-radio>
                      <el-radio value="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="date" label="培训时间">
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
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item prop="status" label="上架状态">
                    <el-radio-group v-model="formData.status">
                      <el-radio value="1">上架</el-radio>
                      <el-radio value="2">下架</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item prop="studyHours" label="要求学时">
                    <el-input-number
                      v-model="formData.studyHours"
                      :min="1"
                      :max="1000"
                      label="要求学时"
                    ></el-input-number>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item prop="studyHoursLength" label="学时长度(秒):">
                <el-input-number
                  v-model="formData.studyHoursLength"
                  :min="1"
                  :max="1000"
                  label="学时长度"
                ></el-input-number>
              </el-form-item>
              <el-form-item prop="introduction" label="培训简介">
                <Editor v-model="formData.introduction"></Editor>
                <!-- <el-input v-model="formData.password" placeholder="请输入" /> -->
              </el-form-item>
            </el-form>
            <template #footer>
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleCreate">确认</el-button>
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
