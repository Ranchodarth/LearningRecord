<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { deleteCourseDataApi, getCourseDataApi } from "@/api/course"
import { type IGetCourseData } from "@/api/course/types/course"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, Download, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { useRouter } from "vue-router"

defineOptions({
  name: "courseList"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter()

//#region 增
// const dialogVisible = ref<boolean>(false)
// // const formRef = ref<FormInstance | null>(null)
// const formData = reactive({
//   username: "",
//   password: ""
// })
// const formRules: FormRules = reactive({
//   username: [{ required: true, trigger: "blur", message: "请输入用户名" }],
//   password: [{ required: true, trigger: "blur", message: "请输入密码" }]
// })
// const handleCreate = () => {
//   formRef.value?.validate((valid: boolean) => {
//     if (valid) {
//       if (currentUpdateId.value === undefined) {
//         createCourseDataApi({
//           username: formData.username,
//           password: formData.password
//         }).then(() => {
//           ElMessage.success("新增成功")
//           dialogVisible.value = false
//           getCourseData()
//         })
//       } else {
//         updateCourseDataApi({
//           id: currentUpdateId.value,
//           username: formData.username
//         }).then(() => {
//           ElMessage.success("修改成功")
//           dialogVisible.value = false
//           getCourseData()
//         })
//       }
//     } else {
//       return false
//     }
//   })
// }
// const resetForm = () => {
//   currentUpdateId.value = undefined
//   formData.username = ""
//   formData.password = ""
// }
//#endregion

//#region 删
const handleDelete = (row: IGetCourseData) => {
  console.log("删除获取参数", row)
  ElMessageBox.confirm(`正在删除课程：${row.courseName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteCourseDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getCourseData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: IGetCourseData) => {
  console.log("拿到ID", row.id)
  currentUpdateId.value = row.id
  handleEditOrAdd("/course/courseEdit", row.id)
  // formData.username = row.username
  // dialogVisible.value = true
}
//#endregion

//#region 查
const CourseData = ref<IGetCourseData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  id: "", //课程id
  courseName: "", //课程名称
  motionType: "", //课程分类
  isSale: "", //上架状态
  dateFrame: "" //时间起止
})

// const value12 = ref("")
// console.log("选择日期:", value12)
//列表接口
const getCourseData = () => {
  loading.value = true
  getCourseDataApi({
    pageIndex: paginationData.pageIndex,
    pageSize: paginationData.pageSize,
    id: searchData.id,
    courseName: searchData.courseName,
    motionType: searchData.motionType,
    isSale: searchData.isSale,
    beginDate: searchData.dateFrame[0],
    endDate: searchData.dateFrame[1]
  })
    .then((res) => {
      paginationData.total = res.data.total
      CourseData.value = res.data.list
    })
    .catch(() => {
      CourseData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.pageIndex === 1) {
    getCourseData()
  }
  paginationData.pageIndex = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.pageIndex === 1) {
    getCourseData()
  }
  paginationData.pageIndex = 1
}
const handleRefresh = () => {
  getCourseData()
}
const onChangeDatePicker = (event: unknown) => {
  console.log("nowXuan", event)
}
const handleEditOrAdd = (url: string, data?: any) => {
  console.log("444", url, data)
  router.push({
    path: url,
    query: {
      id: data
    }
  })
}
//#endregion

/** 监听分页参数的变化 */
watch([() => paginationData.pageIndex, () => paginationData.pageSize], getCourseData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item prop="username" label="课程ID">
          <el-input v-model="searchData.id" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="phone" label="课程名称">
          <el-input v-model="searchData.courseName" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="motionType" label="课程分类" class="items-center">
          <el-select v-model="searchData.motionType" class="m-2" placeholder="选择课程分类">
            <el-option key="1" label="跑步" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item prop="isSale" label="上架状态" class="items-center">
          <el-select v-model="searchData.isSale" class="m-2" placeholder="选择上架状态">
            <el-option key="1" label="上架" value="1" />
            <el-option key="0" label="下架" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="dateFrame" label="创建时间" class="items-center">
          <el-date-picker
            v-model="searchData.dateFrame"
            @change="onChangeDatePicker"
            type="datetimerange"
            unlink-panels
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
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
          <el-button type="primary" :icon="CirclePlus" @click="handleEditOrAdd('/course/courseEdit')"
            >新增课程</el-button
          >
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
        <el-table :data="CourseData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="课程ID" align="center" />
          <el-table-column prop="courseName" label="课程名称" align="center" />
          <el-table-column prop="motionType" label="课程分类" align="center">
            <template #default="scope">
              <el-text class="mx-1">{{ scope.row.motionType === 1 ? "跑步" : "" }}</el-text>
            </template>
          </el-table-column>
          <el-table-column prop="isSale" label="上架状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.isSale" type="success" effect="plain">上架</el-tag>
              <el-tag v-else type="danger" effect="plain">下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="crDate" label="创建时间" align="center" />
          <el-table-column prop="opDate" label="修改时间" align="center" />
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
          :currentPage="paginationData.pageIndex"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>
    <!-- 新增/修改 -->
    <!-- <el-dialog
      v-model="dialogVisible"
      :title="currentUpdateId === undefined ? '新增用户' : '修改用户'"
      @close="resetForm"
      width="30%"
    >
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" label-position="left">
        <el-form-item prop="username" label="用户名">
          <el-input v-model="formData.username" placeholder="请输入" />
        </el-form-item>
        <el-form-item prop="password" label="密码" v-if="currentUpdateId === undefined">
          <el-input v-model="formData.password" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleCreate">确认</el-button>
      </template>
    </el-dialog> -->
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
