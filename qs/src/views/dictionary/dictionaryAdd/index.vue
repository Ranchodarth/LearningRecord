<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import { createDictionaryDataApi, getDictionaryDetailsApi, updateDictionaryDataApi } from "@/api/dictionary"
import type * as Dictionary from "@/api/dictionary/types/dictionary"
import { useRouter, useRoute } from "vue-router"

const loading = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const router = useRouter()
const route = useRoute()
console.log("接收参数", route, route.query.id)
//表单数据
const form = reactive<Dictionary.ICreateDictionaryRequestData>({
  name: "",
  //字典类型
  type: "",
  //数据值
  value: "",
  //创建时间
  crDate: "",
  //修改时间
  opDate: ""
})

//表单校验规则
const rules = reactive<FormRules>({
  value: [
    {
      required: true,
      message: "请输入数据值",
      trigger: "blur"
    }
  ],
  name: [
    {
      required: true,
      message: "请输入字典描述",
      trigger: "blur"
    }
  ],
  type: [
    {
      required: true,
      message: "请输入字典类型",
      trigger: "blur"
    }
  ]
})

//数据详情回调接口
const onGetDetail = (idData: any) => {
  console.log("id", idData)
  getDictionaryDetailsApi(idData).then((res: any) => {
    console.log("查询接口回调", res)
    // form = res
    Object.assign(form, res.data)
  })
}

const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!form.id) {
        createDictionaryDataApi({
          ...form
        }).then((res: any) => {
          console.log(res.code)
          ElMessage.success("新增成功")
          handleEditOrAdd("/dictionary/dictionaryList")
        })
      } else {
        updateDictionaryDataApi({
          ...form
        }).then((res: any) => {
          console.log(res.code)
          ElMessage.success("修改成功")
          handleEditOrAdd("/dictionary/dictionaryList")
        })
      }
    } else {
      ElMessage.error("请检查必填项！")
      console.log("error submit!", fields)
    }
  })
}
//replace页面跳转
const handleEditOrAdd = (url: string) => {
  router.replace(url)
}

//生命周期
onBeforeMount(() => {
  if (route.query.id) {
    onGetDetail(route.query.id)
  }
})
</script>
<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="pt-4 flex">
      <el-form class="mt10" ref="ruleFormRef" :model="form" :rules="rules" :status-icon="true">
        <el-form-item label="描述" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="字典类型" prop="type">
          <!-- <el-select v-model="form.type" placeholder="请选择课程类型">
            <el-option label="字典" :value="1" />
          </el-select> -->
          <el-input v-model="form.type" type="text" />
        </el-form-item>
        <el-form-item label="数据值" prop="value">
          <el-input v-model="form.value" type="text" />
        </el-form-item>
        <el-form-item class="mt10">
          <el-button type="primary" @click="onSubmit(ruleFormRef)">{{ form.id ? "保存修改" : "新增" }}</el-button>
          <el-button @click="handleEditOrAdd('/dictionary/dictionaryList')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.classATitle {
  font-size: 20px;
}
</style>
