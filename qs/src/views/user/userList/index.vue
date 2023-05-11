<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getUserDataApi } from "@/api/user"
import { type IGetUserData } from "@/api/user/types/user"
import { type FormInstance, ElTable } from "element-plus"
import { Search, Refresh } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { downBlobFile } from "@/utils/index"
// 路由跳转
// import { useRouter } from "vue-router"

defineOptions({
  name: "userList"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
// 路由跳转
// const router = useRouter()

//#region 查
const UserData = ref<IGetUserData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  nickName: undefined, // 用户姓名
  phone: undefined, //手机号
  userSource: undefined //渠道
})

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
const selectList = ref<IGetUserData[] | null>([])
//列表接口
const getUserData = () => {
  loading.value = true
  getUserDataApi({
    pageIndex: paginationData.pageIndex,
    pageSize: paginationData.pageSize,
    nickName: searchData.nickName,
    phone: searchData.phone,
    userSource: searchData.userSource
  })
    .then((res) => {
      paginationData.total = res.data.total
      UserData.value = res.data.list
    })
    .catch(() => {
      UserData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
// 查询
const handleSearch = () => {
  if (paginationData.pageIndex === 1) {
    getUserData()
  }
  paginationData.pageIndex = 1
}
// 重置
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.pageIndex === 1) {
    getUserData()
  }
  paginationData.pageIndex = 1
}

// 导出
const leadingOut = () => {
  downBlobFile("/api/admin/user/export", selectList, "用户管理.xlsx")
}
// 多选
const handleSelectionChange = (event: IGetUserData[]) => {
  selectList.value = event
}

/** 监听分页参数的变化 */
watch([() => paginationData.pageIndex, () => paginationData.pageSize], getUserData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item label="昵称">
          <el-input v-model="searchData.nickName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="手机号" class="items-center">
          <el-input v-model="searchData.phone" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="渠道" class="items-center">
          <el-select v-model="searchData.userSource" clearable class="m-2" placeholder="选择渠道">
            <el-option label="wx" value="1" />
            <el-option label="app-android" value="2" />
            <el-option label="app-ios" value="3" />
            <el-option label="web" value="4" />
          </el-select>
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
          <el-button type="primary" @click="leadingOut">导出</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="UserData" @selection-change="handleSelectionChange" ref="multipleTableRef">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="用户ID" align="center" />
          <el-table-column prop="nickName" label="昵称" align="center" />
          <el-table-column prop="phone" label="手机号" align="center" />
          <el-table-column prop="userSource" label="渠道" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.userSource == 1" type="success" effect="plain">wx</el-tag>
              <el-tag v-else-if="scope.row.userSource == 2" type="success" effect="plain">app-android</el-tag>
              <el-tag v-else-if="scope.row.userSource == 3" type="success" effect="plain">app-ios</el-tag>
              <el-tag v-else-if="scope.row.userSource == 4" type="success" effect="plain">web</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="city" label="城市" align="center" />
          <el-table-column prop="crDate" label="创建时间" align="center" />
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
