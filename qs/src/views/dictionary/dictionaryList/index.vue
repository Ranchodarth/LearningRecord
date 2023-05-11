<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { getDictionaryDataApi, deleteDictionaryDataApi } from "@/api/dictionary"
import { type IGetDictionaryData } from "@/api/dictionary/types/dictionary"
import { type FormInstance, ElTable, ElMessageBox, ElMessage } from "element-plus"
import { Search, Refresh, CirclePlus } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
// import { downBlobFile } from "@/utils/index"
// 路由跳转
import { useRouter } from "vue-router"

defineOptions({
  name: "dictionaryList"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
// 路由跳转
const router = useRouter()

//#region 删
const handleDelete = (row: IGetDictionaryData) => {
  console.log("删除获取参数", row)
  ElMessageBox.confirm(`正在删除：${row.name}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteDictionaryDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getDictionaryData()
    })
  })
}

//#endregion
//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: IGetDictionaryData) => {
  console.log("拿到ID", row.id)
  currentUpdateId.value = row.id
  handleEditOrAdd("/dictionary/dictionaryAdd", row.id)
  // formData.username = row.username
  // dialogVisible.value = true
}
//#endregion

//#region 查
const DictionaryData = ref<IGetDictionaryData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  name: "" // 描述
})

const multipleTableRef = ref<InstanceType<typeof ElTable>>()
// const selectList = ref<IGetDictionaryData[] | null>([])
//列表接口
const getDictionaryData = () => {
  loading.value = true
  getDictionaryDataApi({
    pageIndex: paginationData.pageIndex,
    pageSize: paginationData.pageSize,
    name: searchData.name
  })
    .then((res) => {
      paginationData.total = res.data.total
      DictionaryData.value = res.data.list
    })
    .catch(() => {
      DictionaryData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
// 查询
const handleSearch = () => {
  if (paginationData.pageIndex === 1) {
    getDictionaryData()
  }
  paginationData.pageIndex = 1
}
// 重置
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.pageIndex === 1) {
    getDictionaryData()
  }
  paginationData.pageIndex = 1
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
// //#endregion
// // 多选
// const handleSelectionChange = (event: IGetDictionaryData[]) => {
//   selectList.value = event
// }

/** 监听分页参数的变化 */
watch([() => paginationData.pageIndex, () => paginationData.pageSize], getDictionaryData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item label="描述">
          <el-input v-model="searchData.name" clearable placeholder="请输入" />
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
          <el-button type="primary" :icon="CirclePlus" @click="handleEditOrAdd('/dictionary/dictionaryAdd')"
            >新增</el-button
          >
          <!-- <el-button type="primary" @click="leadingOut">导出</el-button> -->
        </div>
      </div>
      <div class="table-wrapper">
        <!--  @selection-change="handleSelectionChange" -->
        <el-table :data="DictionaryData" ref="multipleTableRef">
          <!-- <el-table-column type="selection" width="50" align="center" /> -->
          <el-table-column prop="id" label="ID" align="center" />
          <el-table-column prop="name" label="描述" align="center" />
          <el-table-column prop="type" label="字典类型" align="center" />
          <el-table-column prop="value" label="数据值" align="center" />
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
