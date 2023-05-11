<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import { getToken } from "@/utils/cache/cookies"
import { getUploadUrl } from "@/api/basic"
import { createMarketingDataApi, getMarketingDetailsApi, updateMarketingDataApi } from "@/api/marketing"
import type * as Marketing from "@/api/marketing/types/marketing"
// import { type RouteRecordRaw, RouterLink, useRoute, useRouter } from "vue-router"
import { useRouter, useRoute } from "vue-router"

const loading = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const coverImage = ref<any>("") //已上传封面图
const router = useRouter()
const route = useRoute()
console.log("接收参数", route, route.query.id)
//表单数据
const form = reactive<Marketing.ICreateMarketingRequestData>({
  isSale: 0,
  trueImgUrl: coverImage.value
})

/**特殊规则 */
const validateName = (rule: any, value: any, callback: any) => {
  console.log("form.beginEndTime", form.beginEndTime, form.isSale)
  if (!form.beginEndTime && form.isSale == 1) {
    callback(new Error("请选择生效/失效时间"))
  } else {
    callback()
  }
}

//表单校验规则
const rules = reactive<FormRules>({
  bannerType: [{ required: true, message: "请选择营销位", trigger: "blur" }],
  bannerTitle: [{ required: true, message: "请输入标题", trigger: "blur" }],
  beginEndTime: [{ validator: validateName }],
  trueImgUrl: [{ required: true, message: "请上传图片", trigger: "blur" }],
  linkAction: [{ required: true, message: "请选择行为", trigger: "blur" }],
  path: [{ required: true, message: "请输入链接", trigger: "blur" }],
  imgSeq: [{ required: true, message: "请输入显示顺序", trigger: "blur" }]
})

//上传组件请求头设置
const upLoadHeaders = reactive({
  token: getToken() || ""
})

//上传组件额外参数
const uploadData = reactive({
  type: 2 // 文件类型：1头像2视频封面3视频4其它公共图片
})
//上传文件大小限制
const sizeLimit = ref<number>(0)

//封面图上传成功
const onSuccess = (res: any) => {
  form.trueImgUrl = res.data
  getUploadUrl({
    url: res.data
  }).then((res) => {
    console.log("res", res)
    coverImage.value = res
  })
}

//
const beforeUpload = (file: any) => {
  console.log("file", file)
  sizeLimit.value = file.size / 1024
  console.log("ttt", sizeLimit, sizeLimit.value)
  if (sizeLimit.value > 500) {
    ElMessage.warning("上传文件大小不能超过 500kB!")
    return false
  }
}
const onSubmit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!form.id) {
        createMarketingDataApi({
          ...form
        }).then((res: any) => {
          console.log(res.code)
          ElMessage.success("新增成功")
          handleEditOrAdd("/marketing/marketing")
        })
      } else {
        updateMarketingDataApi({
          ...form
        }).then((res: any) => {
          console.log(res.code)
          ElMessage.success("修改成功")
          handleEditOrAdd("/marketing/marketing")
        })
      }
    } else {
      ElMessage.error("请检查必填项！")
      console.log("error submit!", fields)
    }
  })
}

//数据详情回调接口
const onGetDetail = (idData: any) => {
  console.log("id", idData)
  getMarketingDetailsApi(idData).then((res: any) => {
    console.log("查询接口回调", res)
    // form = res
    if (res.data) {
      Object.assign(form, res.data)
      coverImage.value = res.data.trueCoverUrl //封面图回显
      console.log("ggg", form)
    }
  })
}
// 开始结束时间改变
const changeTime = (val: any) => {
  console.log("val", val)
  if (val && val.length) {
    form.beginEndTime = val
    form.isValidNew = checkAuditTime(val[0], val[1])
  } else {
    form.beginEndTime = []
    form.isValidNew = false
    form.beginExp = ""
    form.endExp = ""
  }
}

const checkAuditTime = (startTime: any, endTime: any) => {
  // 获取当前时间
  const date = new Date()
  // 获取当前时间的年月日
  // 获取开始时间、结束时间、现在时间的时间戳
  let startDate = new Date(startTime)
  let endDate = new Date(endTime)
  const nowDate = date

  const s = startDate > endDate // 判断开始时间否大于结束时间

  if (s) [startDate, endDate] = [endDate, startDate] // 若开始时间否大于结束时间则交换值

  // 判断现在的时间是否在开始时间和结束时间之间，若s为true则结果取反
  if (nowDate > startDate && nowDate < endDate) {
    return s ? false : true
  } else {
    return s ? true : false
  }
}
const defaultTime: [Date, Date] = [new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 2, 1, 23, 59, 59)]

const changeThis = () => {
  form.path = ""
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
    <el-card v-loading="loading" shadow="never" class="pt-4 flex widthNum">
      <div class="flexLR">
        <div>
          <div class="classATitle font-bold">基础信息</div>
          <el-form class="mt10" ref="ruleFormRef" :model="form" :rules="rules" :status-icon="true">
            <el-form-item label="营销位" prop="bannerType">
              <el-select v-model="form.bannerType" placeholder="请选择">
                <el-option label="首页大Banner" :value="1" />
              </el-select>
            </el-form-item>

            <div class="classATitle font-bold">素材内容</div>
            <el-form-item label="标题" prop="bannerTitle">
              <el-input
                type="text"
                v-model="form.bannerTitle"
                placeholder="请输入标题"
                maxlength="20"
                show-word-limit
              />
            </el-form-item>
            <el-form-item :class="form.isSale ? 'is-required' : ''" label="生效/结束时间" prop="beginEndTime">
              <el-date-picker
                v-model="form.beginEndTime"
                type="datetimerange"
                start-placeholder="开始日期"
                range-separator="至"
                end-placeholder="结束日期"
                @change="changeTime"
                :default-time="defaultTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
            <el-form-item label="上传图片" prop="trueImgUrl">
              <!-- 已上传图片展示 -->
              <div class="flex-col">
                <el-image v-show="!!coverImage" style="width: 480px; height: 270px" :src="coverImage" fit="cover" />
                <el-upload
                  v-model="form.trueImgUrl"
                  class="upload-demo w-120 mt-2"
                  accept=".jpg,.JPG"
                  drag
                  :show-file-list="false"
                  action="/api/v1/api/admin/oss/putFile"
                  :headers="upLoadHeaders"
                  :data="uploadData"
                  :before-upload="beforeUpload"
                  :on-success="onSuccess"
                >
                  <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                  <div class="el-upload__text">将文件拖至此处或 <em>点击上传</em></div>
                  <template #tip>
                    <div class="el-upload__tip">仅支持jpg文件格式，文件不能超过500kb。建议尺寸480*270</div>
                  </template>
                </el-upload>
              </div>
            </el-form-item>
            <el-form-item label="行为" prop="linkAction">
              <el-select v-model="form.linkAction" placeholder="请选择" @change="changeThis">
                <el-option label="H5链接" :value="1" />
                <el-option label="课程" :value="2" />
              </el-select>
            </el-form-item>
            <el-form-item label="链接" prop="path" v-if="form.linkAction == 1">
              <el-input type="text" v-model="form.path" placeholder="请输入链接" />
            </el-form-item>
            <el-form-item label="课程ID" prop="path" v-if="form.linkAction == 2">
              <el-input type="text" v-model="form.path" placeholder="请输入课程ID" />
            </el-form-item>
            <el-form-item label="显示顺序" prop="imgSeq">
              <el-input type="number" v-model="form.imgSeq" placeholder="请输入顺序" />
            </el-form-item>

            <div class="classATitle font-bold">上下架控制</div>
            <el-form-item class="mt4">
              <el-switch
                v-model="form.isSale"
                :active-value="1"
                :inactive-value="0"
                size="large"
                inline-prompt
                active-text="上架"
                inactive-text="下架"
              />
            </el-form-item>
            <el-form-item class="mt10">
              <el-button type="primary" @click="onSubmit(ruleFormRef)">{{ form.id ? "保存修改" : "新增" }}</el-button>
              <el-button @click="handleEditOrAdd('/marketing/marketing')">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div style="margin-left: 30%">
          <div class="rightContent">
            <div class="rightImage">
              <el-image
                v-if="form.trueImgUrl"
                style="border-radius: 10px; width: 100%; height: 100%"
                :src="form.trueImgUrl"
              />
              <div v-else class="firstUpload">请先上传</div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<style lang="scss" scoped>
.classATitle {
  font-size: 20px;
}

.rightContent {
  border: 1px solid #ccc;
  height: 800px;
  width: 400px;
  background: url("@/assets/images/indexBackground.png") no-repeat center center;
  background-size: 100% 100%;
  overflow: auto;
  position: relative;
}

.rightImage {
  position: absolute;
  top: 80px;
  height: 200px;
  width: 100%;
  padding: 10px;
  border-radius: 20px;
}
.widthNum {
  width: 100%;
}
.flexLR {
  display: flex;
  justify-content: space-between;
}
.firstUpload {
  width: 100%;
  height: 100%;
  background: #c0c0c0;
  text-align: center;
  padding-top: 80px;
}
</style>
