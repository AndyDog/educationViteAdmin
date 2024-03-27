<template>
  <div class="uploadImg">
    <div class="upload-item">
      <el-upload
        ref="uploadObj"
        :action="uploadFileUrl"
        list-type="picture-card"
        multiple
        :limit="limitNum"
        name="file"
        :file-list="formData.fileList"
        :on-error="handleError"
        :on-change="handleChange"
        :auto-upload="false"
        :acceptType="acceptType"
      >
        <el-icon class="avatar-uploader-icon">
          <Plus />
        </el-icon>
        <template #file="{ file }">
          <div class="fileDiv">
            <div class="fileClass">
              <template v-if="file.status == 'ready'">
                <el-image class="pic-img" :src="file.url" :preview-src-list="[file.url]"> </el-image>
              </template>
              <template v-else>
                <!-- <el-image class="pic-img" :src="loadPath + file.url" :preview-src-list="[loadPath + file.url]">
                </el-image> -->
              </template>
            </div>
            <div class="deleteIcon">
              <el-icon @click="deleteUploadItem(file)"><CircleClose /></el-icon>
            </div>
          </div>
        </template>
      </el-upload>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, watch, nextTick, onMounted } from "vue"
import { ElMessage } from "element-plus"

//const loadPath = window.serverUrl.FILE_SERVER
const uploadFileUrl = ref("#")
const limitNum = ref(1) // 限制一次上传1张
const acceptType = ref(".bmp, .gif, .jpg, .jpeg, .png")
const uploadObj = ref(null)
const formData = reactive({
  fileList: [], // 附件回显列表
  fileOption: [], // 需要上传的附件列表
  uid: ""
})

// 有回显时才需要1
const props = defineProps({
  // 回显的附件列表
  filesData: {
    type: Array,
    default: function () {
      return []
    }
  }
})
const emits = defineEmits()

// 有回显时才需要2
watch(
  () => props.filesData,
  (val) => {
    formData.fileList = []
    if (val) {
      if (val.length > 0) {
        val.forEach((itm, index) => {
          formData.fileList.push({
            name: itm.fileName,
            url: itm.filePath,
            id: itm.id,
            status: "success",
            suffixName: itm.suffixName
          })
        })
      }
    } else {
      formData.fileList = []
    }
  },
  {
    deep: true,
    immediate: true
  }
)

// 删除上传列表
const deleteUploadItem = (file) => {
  var newArr = formData.fileOption
  newArr.forEach((item, index) => {
    if (file.uid == item.uid) {
      newArr.splice(index, 1)
    }
  })
  formData.fileOption = newArr
  uploadObj.value.handleRemove(file)
  emits("updateFileList", formData.fileOption)
  ElMessage.success("删除成功！")
}

// 上传失败
const handleError = () => {
  ElMessage.error(`附件上传失败 !`)
}

const handleChange = (file, fileList) => {
  // 上传校验
  let testmsg = file.name.substring(file.name.lastIndexOf(".") + 1)
  const extension = ["bmp", "gif", "jpg", "jpeg", "png"]
  const isLt2M = file.size / 1024 / 1024 < 30
  if (!extension.includes(testmsg)) {
    ElMessage.warning(`上传文件只能是 bmp、gif、jpg、jpeg、png格式!`)
    fileList.splice(-1, 1) //移除错误文件
    return false
  }
  if (!isLt2M) {
    ElMessage.warning(`上传文件大小不能超过 30MB!`)
    fileList.splice(-1, 1)
    return false
  }

  const addTypeArray = file.name.split(".")
  const addType = addTypeArray[addTypeArray.length - 1]
  file.suffixName = "." + addType

  formData.fileOption.push(file)
  console.log("ddss", formData.fileOption)

  emits("updateFileList", formData.fileOption)
}

onMounted(() => {
  nextTick(() => {
    formData.fileOption = []
  })
})
</script>

<style lang="scss" scoped>
.uploadImg {
  width: 100%;
}
.upload-item {
  width: 100%;
  height: 100%;
  > div {
    width: 100%;
    height: 100%;
  }
}
:deep(.el-upload-list--picture-card) {
  width: 100%;
  height: 100%;
}
:deep(.el-upload-list__item) {
  width: 90px;
  height: 70px;
}
.fileDiv {
  position: relative;
}
.fileClass {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-items: center;
}
:deep(.el-upload--picture-card) {
  width: 90px;
  height: 70px;
}
.deleteIcon {
  position: absolute;
  top: -3px;
  right: 0px;
  cursor: pointer;
}
</style>
