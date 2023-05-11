<script lang="ts" setup>
import { ref, reactive, onBeforeMount } from "vue"
import type { FormInstance, FormRules } from "element-plus"
import { ElMessage } from "element-plus"
import { getToken } from "@/utils/cache/cookies"
import { getUploadUrl } from "@/api/basic"
import { createCourseDataApi, getCourseDetailsApi, updateCourseDataApi } from "@/api/course"
import type * as Course from "@/api/course/types/course"
// import { Delete } from "@element-plus/icons-vue"
// import { type RouteRecordRaw, RouterLink, useRoute, useRouter } from "vue-router"
import { useRouter, useRoute } from "vue-router"

const loading = ref<boolean>(false)
const ruleFormRef = ref<FormInstance>()
const coverImage = ref<any>("") //已上传封面图
const regDistance = /^-?(?:0.\d{0,3}|[1-9][0-9]{0,12}|[0-9]{1,10}.\d{0,3})$/ //纯数字&保留小数点三位&整数最多12位
const fileReaderExample = new FileReader()
const router = useRouter()
const route = useRoute()
console.log("接收参数", route, route.query.id)
//表单数据
const form = reactive<Course.ICreateCourseRequestData>({
  // id: '',
  isSale: 0,
  coverUrl: "",
  trueCoverUrl: coverImage.value,
  courseName: "", //课程标题
  courseDesc: "", //课程简介
  motionType: undefined, //课程类型
  difficultyLevels: 1, //难度等级
  targetType: 2, //运动目标
  speed: "",
  courseImgs: [] as any[],
  targetStages: [{ speed: "", targetStage: undefined }] as any[],
  durationTime: "",
  calorie: undefined, //卡路里
  distance: undefined //距离
})

/**特殊规则 */
const validatePassDistance = (rule: any, value: any, callback: any) => {
  if (!regDistance.test(value) && form.targetType === 2) {
    ElMessage.warning("只能输入数字，且保留小数点后3位")
  } else {
    return callback()
  }
}

const validatePassCalorie = (rule: any, value: any, callback: any) => {
  if (!regDistance.test(value) && form.targetType === 3) {
    ElMessage.warning("只能输入数字，且保留小数点后3位")
  } else {
    return callback()
  }
}

//表单校验规则
const rules = reactive<FormRules>({
  trueCoverUrl: [{ required: true, message: "请上传封面", trigger: "blur" }],
  courseName: [{ required: true, message: "请输入标题", trigger: "blur" }],
  courseDesc: [{ required: true, message: "请输入课程简介", trigger: "blur" }],
  motionType: [{ required: true, message: "请选择课程类型", trigger: "blur" }],
  difficultyLevels: [{ required: true, message: "请选择难度等级", trigger: "blur" }],
  targetType: [{ required: true, message: "请选择运动目标", trigger: "blur" }],
  distance: [
    { required: form.targetType === 2 ? true : false, message: "请输入距离", trigger: "blur" },
    { validator: validatePassDistance, trigger: "blur" }
  ],
  durationTime: [{ required: form.targetType === 1 ? true : false, message: "请输入时间", trigger: "blur" }],
  calorie: [
    { required: form.targetType === 3 ? true : false, message: "请输入卡路里", trigger: "blur" },
    { validator: validatePassCalorie, trigger: "blur" }
  ],
  courseImgs: [{ required: true, message: "请上传课程介绍", trigger: "blur" }],
  speed: [{ required: true, message: "请输入速度", trigger: "blur" }]
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
  console.log("131awd", res.data)
  form.coverUrl = res.data
  getUploadUrl({
    url: res.data
  }).then((res) => {
    console.log("res", res)
    coverImage.value = res
  })
}

//课程介绍上传成功
const onSuccessList = (res: any, file: any) => {
  fileReaderExample.onload = function (event) {
    const txt: any = event.target?.result
    const img = document.createElement("img")
    img.src = txt
    img.onload = function () {
      console.log(img.width)
      console.log(img.height)
      if (res.data.code == 500) {
        // that.$message.error(res.data.msg)
        return
      }
      getUploadUrl({ url: res.data }).then((response) => {
        console.log("response", response)
        form.trueCoverUrl = response
        // if (response.data.code == 500) {
        //   that.$message.error(response.data.msg)
        //   return
        // }
        const lll = {
          imageUrl: res.data,
          trueImageUrl: response.data,
          imageName: file.name,
          imgWidth: img.width,
          imgHeight: img.height
        }
        form.courseImgs.push(lll)
      })
    }
  }
  fileReaderExample.readAsDataURL(file.raw)
}

//课程介绍上传(多文件上传存储)
const handleRemoveList = (file: any, fileList: any) => {
  console.log(file, fileList)
  form.courseImgs = fileList
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
  // updateCourseDataApi

  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      if (!form.id) {
        createCourseDataApi({
          ...form
        }).then((res: any) => {
          console.log(res.code)
          ElMessage.success("新增成功")
          handleEditOrAdd("/course/courseList")
        })
      } else {
        updateCourseDataApi({
          ...form
        }).then((res: any) => {
          console.log(res.code)
          ElMessage.success("修改成功")
          handleEditOrAdd("/course/courseList")
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
  getCourseDetailsApi(idData).then((res: any) => {
    console.log("查询接口回调", res)
    // form = res
    Object.assign(form, res.data)
    coverImage.value = res.data.trueCoverUrl //封面图回显
    console.log("ggg", form)
  })
}
//删除课程介绍文件
const delImgList = (index: number) => {
  form.courseImgs.splice(index, 1)
}

//增加阶段速度
// const handleStageAdd = () => {
//   form.targetStages.push({ speed: "", targetStage: undefined })
//   console.log("整个结构", form.targetStages)
// }
// //删除阶段速度
// const handleStageDel = (index: number) => {
//   form.targetStages.splice(index, 1)
// }

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
      <div class="classATitle font-bold mb10">基础信息</div>
      <el-form class="mt10" ref="ruleFormRef" :model="form" :rules="rules" :status-icon="true" label-width="100px">
        <!-- 封面图 -->
        <el-form-item label="封面图" prop="trueCoverUrl">
          <!-- 已上传图片展示 -->
          <div class="flex-col">
            <el-image v-show="!!coverImage" style="width: 480px; height: 270px" :src="coverImage" fit="cover" />
            <el-upload
              v-model="form.trueCoverUrl"
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

        <!-- 标题/会员权限 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程标题" prop="courseName">
              <el-input v-model="form.courseName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="会员权限" prop="motionType">
              <el-select v-model="form.motionType" placeholder="请选择会员权限">
                <el-option label="订阅会员" :value="1" />
                <el-option label="所有会员" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- <el-form-item label="课程简介" prop="courseDesc">
          <el-input v-model="form.courseDesc" type="textarea" />
        </el-form-item> -->

        <!-- 课程视频 -->
        <!-- 教练 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="教练" prop="motionType">
              <el-select v-model="form.motionType" placeholder="请选择教练">
                <el-option label="订阅会员" :value="1" />
                <el-option label="所有会员" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 课程分类/课程标签 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="课程分类" prop="motionType">
              <el-select v-model="form.motionType" placeholder="请选择课程类型">
                <el-option label="跑步" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="课程标签" prop="motionType">
              <el-select v-model="form.motionType" placeholder="请选择课程标签">
                <el-option label="标签1" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 课程指标 -->
        <div class="classATitle font-bold mt10 mb10">课程指标</div>
        <!-- <el-form :model="form" class="mt10"> -->
        <el-col :span="12">
          <el-form-item label="难度等级" prop="difficultyLevels">
            <el-select v-model="form.difficultyLevels" placeholder="请选择难度等级">
              <el-option label="入门" :value="1" />
              <el-option label="简单" :value="2" />
              <el-option label="中等" :value="3" />
              <el-option label="困难" :value="4" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="卡路里" prop="courseName">
            <el-input v-model="form.courseName" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="课程时长" prop="courseName">
            <el-input v-model="form.courseName" />
          </el-form-item>
        </el-col>
        <!-- <el-form-item label="运动目标" prop="targetType">
          <el-radio-group v-model="form.targetType">
            <el-radio :label="2" :value="2">距离</el-radio>
            <el-radio :label="1" :value="1">时间</el-radio>
            <el-radio :label="3" :value="3">卡路里</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="距离" prop="distance" v-show="form.targetType === 2">
          <el-input v-model="form.distance" placeholder="请输入距离">
            <template #append>公里</template>
          </el-input>
        </el-form-item>
        <el-form-item label="时间" prop="durationTime" v-show="form.targetType === 1">
          <el-time-picker v-model="form.durationTime" placeholder="Pick a time" style="width: 100%" />
        </el-form-item>
        <el-form-item label="卡路里" prop="calorie" v-show="form.targetType === 3">
          <el-input v-model="form.calorie" placeholder="请输入卡路里">
            <template #append>千卡</template>
          </el-input>
        </el-form-item> -->
        <!-- 结构化还没写v-for -->
        <!-- <el-form-item label="速度" prop="targetStages" v-for="(item, index) in form.targetStages" :key="index">
          <el-input v-model="item.speed" placeholder="请输入">
            <template #append>{{ "用个计算属性" }}</template>
          </el-input>
          <el-input v-model="item.targetStage" placeholder="请输入">
            <template #append>kph</template>
          </el-input>
          <el-button v-if="index !== 0" type="danger" :icon="Delete" circle @click="handleStageDel(index)" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleStageAdd">增加阶段速度</el-button>
        </el-form-item> -->
        <!-- </el-form> -->

        <!-- 辅助需求 -->
        <div class="classATitle font-bold mt10 mb10">辅助需求</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="器械" prop="motionType">
              <el-select v-model="form.motionType" placeholder="请选择器械">
                <el-option label="订阅会员" :value="1" />
                <el-option label="所有会员" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="辅助装备" prop="motionType">
              <el-select v-model="form.motionType" placeholder="请选择辅助装备">
                <el-option label="订阅会员" :value="1" />
                <el-option label="所有会员" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 课程介绍 -->
        <div class="classATitle font-bold mt10 mb10">课程介绍</div>
        <!-- <el-form :model="form" class="mt10"> -->

        <div v-for="(item, index) in form.courseImgs" :key="index" class="flex flex-items-center m-4">
          <div class="flex flex-items-center mr-4">{{ item.imageName || "图片名称" }}</div>
          <el-button type="danger" @click="delImgList(index)">删除</el-button>
        </div>
        <el-form-item label="" prop="courseImgs">
          <el-upload
            v-model="form.courseImgs"
            class="upload-demo w-120 mt-2"
            accept=".jpg,.JPG"
            drag
            action="/api/v1/api/admin/oss/putFile"
            :headers="upLoadHeaders"
            :data="uploadData"
            :before-upload="beforeUpload"
            :on-success="onSuccessList"
            :on-remove="handleRemoveList"
          >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖至此处或 <em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">仅支持jpg格式，大小不超过500k。尺寸建议500*500</div>
            </template>
          </el-upload>
        </el-form-item>
        <!-- </el-form> -->
        <!-- <el-form :model="form" class="mt10 flex flex flex-justify-end"> -->
        <div class="classATitle font-bold mt10 mb10">上下架控制</div>
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
          <el-button>取消</el-button>
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
