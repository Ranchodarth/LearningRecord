<script lang="ts" setup>
import { reactive, ref, watch } from "vue"
import { deleteMarketingDataApi, getMarketingDataApi } from "@/api/marketing"
import { type IGetMarketingData } from "@/api/marketing/types/marketing"
import { type FormInstance, ElMessage, ElMessageBox } from "element-plus"
import { Search, Refresh, CirclePlus, RefreshRight } from "@element-plus/icons-vue"
import { usePagination } from "@/hooks/usePagination"
import { useRouter } from "vue-router"

defineOptions({
  name: "marketingList"
})

const loading = ref<boolean>(false)
const { paginationData, handleCurrentChange, handleSizeChange } = usePagination()
const router = useRouter()

//#region 删
const handleDelete = (row: IGetMarketingData) => {
  console.log("删除获取参数", row)
  ElMessageBox.confirm(`正在删除营销位：${row.marketingName}，确认删除？`, "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(() => {
    deleteMarketingDataApi(row.id).then(() => {
      ElMessage.success("删除成功")
      getMarketingData()
    })
  })
}
//#endregion

//#region 改
const currentUpdateId = ref<undefined | string>(undefined)
const handleUpdate = (row: IGetMarketingData) => {
  console.log("拿到ID", row.id)
  currentUpdateId.value = row.id
  handleEditOrAdd("/marketing/marketingEdit", row.id)
}
//#endregion

//#region 查
const MarketingData = ref<IGetMarketingData[]>([])
const searchFormRef = ref<FormInstance | null>(null)
const searchData = reactive({
  id: "", // 营销位id
  bannerTitle: "", // 营销位名称
  isSale: "", //上架状态
  beginExp: "" //时间起止
})

//列表接口
const getMarketingData = () => {
  loading.value = true
  getMarketingDataApi({
    pageIndex: paginationData.pageIndex,
    pageSize: paginationData.pageSize,
    id: searchData.id,
    bannerTitle: searchData.bannerTitle,
    isSale: searchData.isSale,
    beginDate: searchData.beginExp[0],
    endDate: searchData.beginExp[1]
  })
    .then((res) => {
      paginationData.total = res.data.total
      MarketingData.value = res.data.list
    })
    .catch(() => {
      MarketingData.value = []
    })
    .finally(() => {
      loading.value = false
    })
}
const handleSearch = () => {
  if (paginationData.pageIndex === 1) {
    getMarketingData()
  }
  paginationData.pageIndex = 1
}
const resetSearch = () => {
  searchFormRef.value?.resetFields()
  if (paginationData.pageIndex === 1) {
    getMarketingData()
  }
  paginationData.pageIndex = 1
}
const handleRefresh = () => {
  getMarketingData()
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
watch([() => paginationData.pageIndex, () => paginationData.pageSize], getMarketingData, { immediate: true })
</script>

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item label="id">
          <el-input v-model="searchData.id" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="营销位标题" class="items-center">
          <el-input v-model="searchData.bannerTitle" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="是否上架" class="items-center">
          <el-select v-model="searchData.isSale" clearable class="m-2" placeholder="选择渠道">
            <el-option label="已上架" value="1" />
            <el-option label="已下架" value="0" />
          </el-select>
        </el-form-item>
        <el-form-item prop="dateFrame" label="生效时间" class="items-center">
          <el-date-picker
            v-model="searchData.beginExp"
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
          <el-button type="primary" :icon="CirclePlus" @click="handleEditOrAdd('/marketing/marketingEdit')"
            >新增</el-button
          >
        </div>
        <div>
          <el-tooltip content="刷新表格">
            <el-button type="primary" :icon="RefreshRight" circle @click="handleRefresh" />
          </el-tooltip>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="MarketingData">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="Banner ID" align="center" />
          <el-table-column prop="trueImgUrl" label="图片" align="center">
            <template #default="scope">
              <el-image style="width: 100px; height: 100px" :src="scope.row.trueImgUrl" />
            </template>
          </el-table-column>
          <el-table-column prop="path" label="位置" align="center" />
          <el-table-column prop="bannerTitle" label="营销位标题" align="center" />
          <el-table-column prop="imgSeq" label="顺序" align="center" />
          <el-table-column prop="isSale" label="上架状态" align="center">
            <template #default="scope">
              <el-tag v-if="scope.row.isSale" type="success" effect="plain">上架</el-tag>
              <el-tag v-else type="danger" effect="plain">下架</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="beginExp" label="生效时间" align="center" />
          <el-table-column prop="endExp" label="结束时间" align="center" />
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
