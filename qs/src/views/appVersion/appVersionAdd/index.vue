<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import { getToken } from "@/utils/cache/cookies"
import { getUploadUrl } from "@/api/basic"
import { createAppVersionDataApi } from "@/api/appVersion"
import type * as AppVersion from "@/api/appVersion/types/appVersion"
import { useRouter, useRoute } from "vue-router"

const loading = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const coverApk = ref<unknown>("") //已上传封面图
const router = useRouter()
const route = useRoute()
console.log("接收参数", route, route.query.id)
//表单数据
const form = reactive<AppVersion.ICreateAppVersionRequestData>({
  id: "",
  appName: "",
  downloadUrl: "",
  appType: "",
  appSize: "",
  appVersionCode: "",
  appVersionName: "",
  remarks: ""
})

//表单校验规则
const rules = reactive<FormRules>({
  appName: [
    { required: true, message: "app名称不能为空", trigger: "blur" },
    {
      max: 20,
      required: true,
      message: "长度在20 个字符内",
      trigger: "blur"
    }
  ],
  downloadUrl: [{ required: true, message: "请上传apk包", trigger: "blur" }],
  appVersionCode: [{ required: true, message: "请输入", trigger: "blur" }],
  appType: [{ required: true, message: "请选择", trigger: "blur" }],
  appVersionName: [{ required: true, message: "请输入", trigger: "blur" }],
  version: [{ required: true, message: "请输入版本号", trigger: "blur" }]
})

//上传组件请求头设置
const upLoadHeaders = reactive({
  token: getToken() || ""
})

//上传组件额外参数
const uploadData = reactive({
  type: 5 // 文件类型：1头像2视频封面3视频4其它公共图片
})

//上传文件大小限制
// const sizeLimit = ref<number>(0)

//封面图上传成功
const onSuccess = (res: any) => {
  console.log("131awd", res.data)
  form.downloadUrl = res.data
  getUploadUrl({
    url: res.data
  }).then((res) => {
    console.log("res", res)
    coverApk.value = res
  })
}

//
// const beforeUpload = (file: any) => {
//   console.log("file", file)
//   sizeLimit.value = file.size / 1024
//   console.log("ttt", sizeLimit, sizeLimit.value)
//   if (sizeLimit.value > 500) {
//     ElMessage.warning("上传文件大小不能超过 500kB!")
//     return false
//   }
// }
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!form.id) {
        createAppVersionDataApi({
          ...form
        }).then((res: any) => {
          console.log(res.code)
          ElMessage.success("新增成功")
          handleEditOrAdd("/appVersion/appVersionList")
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
    // onGetDetail(route.query.id)
  }
})
</script>
<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="pt-4 flex">
      <div class="classATitle font-bold">基础信息</div>
      <el-form ref="ruleFormRef" :model="form" :rules="rules" label-width="80px" :status-icon="true">
        <el-form-item label="app名称" prop="appName">
          <el-input v-model="form.appName" placeholder="请输入app名称" maxlength="20" show-word-limit />
        </el-form-item>
        <el-form-item label="版本号" prop="appVersionCode">
          <el-input v-model="form.appVersionCode" placeholder="请输入版本号" />
        </el-form-item>
        <el-form-item label="类型" prop="appType">
          <el-select v-model="form.appType" placeholder="请选择类型">
            <el-option label="Android" value="0" />
            <el-option label="IOS" value="1" />
          </el-select>
        </el-form-item>

        <el-form-item label="版本名称" prop="appVersionName">
          <el-input v-model="form.appVersionName" placeholder="请输入版本名称" />
        </el-form-item>
        <el-form-item label="app大小" prop="appSize">
          <el-input v-model="form.appSize" placeholder="请输入版本名称" />
        </el-form-item>

        <el-form-item label="备注信息" prop="remarks">
          <el-input v-model="form.remarks" placeholder="请输入备注" maxlength="50" show-word-limit />
        </el-form-item>
        <el-form-item label="app华为云地址" prop="downloadUrl">
          <el-upload
            v-model="form.downloadUrl"
            class="upload-demo w-120 mt-2"
            accept=".apk, .ipa, .pxi, .deb"
            drag
            :show-file-list="false"
            action="/api/v1/api/admin/oss/putFile"
            :headers="upLoadHeaders"
            :data="uploadData"
            :on-success="onSuccess"
          >
            <!-- :before-upload="beforeUpload" -->
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖至此处或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">仅支持jpg文件格式，文件不能超过500kb。建议尺寸480*270</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit(ruleFormRef)">确 定</el-button>
          <el-button @click="handleEditOrAdd('/appVersion/appVersionList')">取 消</el-button>
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
