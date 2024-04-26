<!--
 * SelectTable 下拉表格组件
 * @author: Goal
 * @since: 2023-11-13
 * SelectTable.vue
 *
 * 属性(带有[Required]为必填属性)
 * data[Required]: 双向绑定数据
 * fields[Required]: 表格列对象
 * tableData[Required]: 表格数据对象
 * value: 双向绑定数据的值(为空时data属性为表格当前行数据对象)
 * label: 选择框显示的文本内容(为空时分别查看value和objKey是否为空,若value和objKey都有值,则value优先级大于objKey)
 * objKey: 对象key(绑定值的唯一标识，绑定值为对象时必填)
 * placeholder: 选择框占位文本
 * size: 组件大小
 * border: 表格是否带有边框
-->
<template>
  <div>
    <el-select ref="selectTable" v-model="state.selectShowValue" :placeholder="props.placeholder" :size="props.size">
      <template #empty>
        <el-table
          :data="props.tableData"
          :highlight-current-row="props.isHighlight"
          style="width: 100%"
          :size="props.size"
          :border="props.border"
          @current-change="handleCurrentChange"
        >
          <el-table-column
            v-for="field in props.fields"
            :prop="field.prop"
            :label="field.label"
            :width="field.width"
            :show-overflow-tooltip="field.showTooltip"
          />
        </el-table>
      </template>
    </el-select>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue"

interface Field {
  prop: string
  label: string
  width: number
  showTooltip?: boolean
}

interface Props {
  data: any
  fields: Field[]
  tableData: object[]
  label?: string
  value?: string
  objKey?: string
  isHighlight?: boolean
  size?: string
  placeholder?: string
  border?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  placeholder: "请选择",
  size: "default",
  isHighlight: true,
  value: undefined,
  label: undefined,
  border: false
})

interface Emits {
  (e: "update:data", val: any): void
}

const emits = defineEmits<Emits>()

onMounted(() => {
  //处理数据回显
  // debugger;
  if (props.data !== null) {
    // 配置label则显示label
    if (typeof props.label !== "undefined") {
      // 配置了value属性，则找到与value属性值一样的表格行对象，将配置的label回显到下拉框
      if (typeof props.value !== "undefined") {
        let row = props.tableData.find((item) => item[props.value] === props.data)
        state.selectShowValue = typeof row === "undefined" ? props.data : row[props.label]
        // 配置了objKey属性，则找到与objKey属性值一样的表格行对象，将配置的label回显到下拉框
      } else if (typeof props.objKey !== "undefined") {
        let row = props.tableData.find((item) => item[props.objKey] === props.data[props.objKey])
        state.selectShowValue = typeof row === "undefined" ? props.data[props.objKey] : row[props.label]
      }
      //没有配置label属性则回显value或者objKey
    } else {
      // 配置了value属性，则找到与value属性值一样的表格行对象，将配置的label回显到下拉框
      if (typeof props.value !== "undefined") {
        let row = props.tableData.find((item) => item[props.value] === props.data)
        state.selectShowValue = typeof row === "undefined" ? props.data : row[props.value]
        // 配置了objKey属性，则找到与objKey属性值一样的表格行对象，将配置的label回显到下拉框
      } else if (typeof props.objKey !== "undefined") {
        let row = props.tableData.find((item) => item[props.objKey] === props.data)
        state.selectShowValue = typeof row === "undefined" ? props.data : row[props.objKey]
      }
    }
  }
})

const selectTable = ref()

const state = reactive({
  selectValue: null,
  selectShowValue: null
})

/**
 * 点击当前行事件
 * @param val
 */
const handleCurrentChange = (val: any) => {
  // 如果没有配置label则显示value或者objKey
  setLabel(val)
  //  设置双向绑定值
  if (typeof props.value !== "undefined") {
    emits("update:data", val[props.value])
  } else {
    emits("update:data", val)
  }
  selectTable.value.blur()
}

const setLabel = (val: any) => {
  // 如果没有配置label则显示value或者objKey
  if (typeof props.label === "undefined") {
    // 如果配置了value,则显示value
    if (typeof props.value !== "undefined") {
      state.selectShowValue = val[props.value]
    } else if (typeof props.objKey !== "undefined") {
      //没有配置value但配置了objKey,则显示objKey
      state.selectShowValue = val[props.objKey]
    }
  } else {
    state.selectShowValue = val[props.label]
  }
}
</script>

<style scoped></style>
