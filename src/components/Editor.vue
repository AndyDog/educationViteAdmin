<!-- 自定义的富文本框的组件 -->
<template>
  <div style="border: 1px solid #ccc">
    <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" />
    <Editor
      style="height: 300px; overflow-y: hidden"
      v-model="valueHtml"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css" // 引入 css
import { ref, shallowRef, onMounted, watch } from "vue"
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"
// import { uploadApi } from "@/api"
//定义modelValue属性
const props = defineProps({ modelValue: { type: String, default: "" } })
const emit = defineEmits(["update:modelValue"])

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
// 内容 HTML
const valueHtml = ref("")

watch(
  () => props.modelValue,
  () => {
    editorRef.value.setHtml(props.modelValue)
  }
)

const handleCreated = (editor: any) => {
  editorRef.value = editor // 记录 editor 实例，重要！

  editor.setHtml(props.modelValue)

  editor.getConfig().MENU_CONF["uploadImage"] = {
    // 自定义上传
    async customUpload(file: File, insertFn: any) {
      // TS 语法
      // file 即选中的文件
      // 自己实现上传，并得到图片 url alt href
      // 最后插入图片
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (f) => {
        // uploadApi.upload.call({ name: file.name, base64: f.target?.result }).then((url: any) => {
        //   insertFn(url, file.name, url)
        // })
      }
    }
  }
  editor.getConfig().MENU_CONF["uploadVideo"] = {
    // 自定义上传
    async customUpload(file: File, insertFn: any) {
      // TS 语法
      // file 即选中的文件
      // 自己实现上传，并得到图片 url alt href
      // 最后插入图片
      let reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (f) => {
        // uploadApi.upload.call({ name: file.name, base64: f.target?.result }).then((url: any) => {
        //   // 从 res 中找到 url poster ，然后插入视频
        //   insertFn(url, "")
        // })
      }
    }
  }
}

const handleChange = (editor: any) => {
  emit("update:modelValue", editor.getHtml())
}
</script>
