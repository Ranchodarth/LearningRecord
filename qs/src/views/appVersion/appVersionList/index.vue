<script lang="ts" setup>
import { ref, watch } from "vue"
import { getAppVersionDataApi } from "@/api/appVersion"
import { type IGetAppVersionData } from "@/api/appVersion/types/appVersion"
import { type ElTable } from "element-plus"
import { usePagination } from "@/hooks/usePagination"
// 路由跳转
import { useRouter } from "vue-router"

defineOptions({
  name: "appVersionList"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
// 路由跳转
const router = useRouter()

//#region 查
const AppVersionData = ref<IGetAppVersionData[]>([])

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
//列表接口
const getAppVersionData = () => {
  loading.value = true
  getAppVersionDataApi({
    pageIndex: paginationData.pageIndex,
    pageSize: paginationData.pageSize
  })
    .then((res) => {
      paginationData.total = res.data.total
      AppVersionData.value = res.data.list
    })
    .catch(() => {
      AppVersionData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}

// 新增
const handleEditOrAdd = (url: string, data?: any) => {
  router.push({
    path: url,
    query: {
      id: data
    }
  })
}

/** 监听分页参数的变化 */
watch([() => paginationData.pageIndex, () => paginationData.pageSize], getAppVersionData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-button type="primary" @click="handleEditOrAdd('/appVersion/appVersionAdd')">新增</el-button>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="AppVersionData" ref="multipleTableRef">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="appName" label="app名称" align="center" />
          <el-table-column prop="downloadUrl" label="app地址" align="center" />
          <el-table-column prop="appSize" label="app大小" align="center" />
          <el-table-column prop="appVersionCode" label="版本号" align="center" />
          <el-table-column prop="appVersionName" label="版本名称" align="center" />
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
