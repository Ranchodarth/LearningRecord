<!-- <template>
  <div class="container">
    <div class="upload">
      <div>
        <input type="file" id="fileUpload" @change="fileChange($event)" />
        <label class="status"
          >上传状态: <span>{{ statusText }}</span></label
        >
      </div>
      <div class="upload-type">
        上传方式一, 使用 UploadAuth 上传:
        <button @click="authUpload" :disabled="uploadDisabled">开始上传</button>
        <button @click="pauseUpload" :disabled="pauseDisabled">暂停</button>
        <button :disabled="resumeDisabled" @click="resumeUpload">恢复上传</button>
        <span class="progress"
          >上传进度: <i id="auth-progress">{{ authProgress }}</i> %</span
        >
      </div>
    </div>

    <div class="info">
      uploadAuth及uploadAddress参数请查看<a href="https://help.aliyun.com/document_detail/55407.html" target="_blank"
        >获取上传地址和凭证</a
      >
    </div>
  </div>
</template> -->

<template>
  <div class="app-container">
    <el-card v-loading="loading" shadow="never" class="search-wrapper">
      <el-form ref="searchFormRef" :inline="true" :model="searchData">
        <el-form-item label="视频ID" class="items-center">
          <el-input v-model="searchData.phone" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item label="视频名称">
          <el-input v-model="searchData.nickName" clearable placeholder="请输入" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :icon="Search" @click="handleSearch">{{ statusText }}</el-button>
          <el-button :icon="Refresh" @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-loading="loading" shadow="never">
      <div class="toolbar-wrapper">
        <div>
          <el-upload
            class="upload-demo w-120 mt-2"
            accept=".mp4"
            :show-file-list="false"
            action="/api/v1/api/admin/oss/putFile"
            :headers="upLoadHeaders"
            :data="uploadData"
            :before-upload="beforeUpload"
            :on-change="onChange"
            :on-success="onSuccess"
            :auto-upload="false"
          >
            <!-- <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖至此处或 <em>点击上传</em></div> -->
            <el-button type="primary" @click="leadingOut">上传</el-button>
            <!-- <template #tip>
              <div class="el-upload__tip">仅支持jpg文件格式，文件不能超过500kb。建议尺寸480*270</div>
            </template> -->
          </el-upload>
        </div>
      </div>
      <div class="table-wrapper">
        <el-table :data="UserData" @selection-change="handleSelectionChange" ref="multipleTableRef">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column prop="id" label="视频ID" align="center" />
          <el-table-column prop="nickName" label="视频名称" align="center" />
          <el-table-column prop="phone" label="视频大小" align="center" />
          <el-table-column prop="phone" label="视频时长" align="center" />
          <el-table-column prop="crDate" label="创建时间" align="center" />
          <el-table-column fixed="right" label="操作" width="150" align="center">
            <template #default="scope">
              <el-button type="danger" text bg size="small" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="pager-wrapper">
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
      </div> -->
    </el-card>
  </div>
</template>

<script>
import axios from "axios"
import { getVideoVoucherApi } from "@/api/video"

export default {
  data() {
    return {
      timeout: "",
      partSize: "",
      parallel: "",
      retryCount: "",
      retryDuration: "",
      region: "cn-shanghai",
      userId: "1204773399977749",
      file: null,
      authProgress: 0,
      uploadDisabled: true,
      resumeDisabled: true,
      pauseDisabled: true,
      uploader: null,
      statusText: "",
      videoName: "", //视频name
      searchData: {
        nickName: undefined, // 用户姓名
        phone: undefined, //手机号
        userSource: undefined //渠道
      }
    }
  },
  methods: {
    fileChange(e) {
      this.file = e.target.files[0]
      if (!this.file) {
        alert("请先选择需要上传的文件!")
        return
      }
      const Title = this.file.name
      const userData = '{"Vod":"11","Title":"123"}'
      if (this.uploader) {
        this.uploader.stopUpload()
        this.authProgress = 0
        this.statusText = ""
      }
      this.uploader = this.createUploader()
      console.log("123ada", Title, userData)
      this.uploader.addFile(this.file, null, null, null, userData)
      this.uploadDisabled = false
      this.pauseDisabled = true
      this.resumeDisabled = true
    },
    authUpload() {
      // 然后调用 startUpload 方法, 开始上传
      if (this.uploader !== null) {
        this.uploader.startUpload()
        this.uploadDisabled = true
        this.pauseDisabled = false
      }
    },
    // 暂停上传
    pauseUpload() {
      if (this.uploader !== null) {
        this.uploader.stopUpload()
        this.resumeDisabled = false
        this.pauseDisabled = true
      }
    },
    // 恢复上传
    resumeUpload() {
      if (this.uploader !== null) {
        this.uploader.startUpload()
        this.resumeDisabled = true
        this.pauseDisabled = false
      }
    },
    createUploader() {
      const self = this
      const uploader = new AliyunUpload.Vod({
        timeout: self.timeout || 60000,
        partSize: Math.round(self.partSize || 1048576),
        parallel: self.parallel || 5,
        retryCount: self.retryCount || 3,
        retryDuration: self.retryDuration || 2,
        region: "cn-beijing",
        userId: self.userId,
        // 添加文件成功
        addFileSuccess: function (uploadInfo) {
          self.uploadDisabled = false
          self.resumeDisabled = false
          self.statusText = "添加文件成功, 等待上传..."
          self.videoName = uploadInfo.file.name
          console.log("addFileSuccess: " + uploadInfo.file.name, uploadInfo)
        },
        // 开始上传
        onUploadstarted: function (uploadInfo) {
          // 如果是 UploadAuth 上传方式, 需要调用 uploader.setUploadAuthAndAddress 方法
          // 如果是 UploadAuth 上传方式, 需要根据 uploadInfo.videoId是否有值，调用点播的不同接口获取uploadauth和uploadAddress
          // 如果 uploadInfo.videoId 有值，调用刷新视频上传凭证接口，否则调用创建视频上传凭证接口
          // 注意: 这里是测试 demo 所以直接调用了获取 UploadAuth 的测试接口, 用户在使用时需要判断 uploadInfo.videoId 存在与否从而调用 openApi
          // 如果 uploadInfo.videoId 存在, 调用 刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)
          // 如果 uploadInfo.videoId 不存在,调用 获取视频上传地址和凭证接口(https://help.aliyun.com/document_detail/55407.html)
          if (!uploadInfo.videoId) {
            // const createUrl =
            //   "https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/CreateUploadVideo?Title=testvod1&FileName=aa.mp4&BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&VideoId=5bfcc7864fc14b96972842172207c9e6"
            // axios.get(createUrl).then(({ data }) => {
            //   const uploadAuth = data.UploadAuth
            //   const uploadAddress = data.UploadAddress
            //   const videoId = data.VideoId
            //   uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            // })
            getVideoVoucherApi(this.videoName)
              .then((res) => {
                const uploadAuth = res.data.uploadAuth
                const uploadAddress = res.data.uploadAddress
                const videoId = res.data.videoId
                console.log("返回值", uploadAuth, uploadAddress, videoId)
                uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
              })
              .catch(() => {
                // UserData.value = []
              })
              .finally(() => {
                // loading.value = false
              })
            self.statusText = "文件开始上传..."
            console.log(
              "onUploadStarted:" +
                uploadInfo.file.name +
                ", endpoint:" +
                uploadInfo.endpoint +
                ", bucket:" +
                uploadInfo.bucket +
                ", object:" +
                uploadInfo.object
            )
          } else {
            // 如果videoId有值，根据videoId刷新上传凭证
            // https://help.aliyun.com/document_detail/55408.html?spm=a2c4g.11186623.6.630.BoYYcY
            const refreshUrl =
              "https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=" +
              uploadInfo.videoId
            axios.get(refreshUrl).then(({ data }) => {
              const uploadAuth = data.UploadAuth
              const uploadAddress = data.UploadAddress
              const videoId = data.VideoId
              uploader.setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId)
            })
          }
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) {
          console.log(
            "onUploadSucceed: " +
              uploadInfo.file.name +
              ", endpoint:" +
              uploadInfo.endpoint +
              ", bucket:" +
              uploadInfo.bucket +
              ", object:" +
              uploadInfo.object
          )
          self.statusText = "文件上传成功!"
        },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) {
          console.log("onUploadFailed: file:" + uploadInfo.file.name + ",code:" + code + ", message:" + message)
          self.statusText = "文件上传失败!"
        },
        // 取消文件上传
        onUploadCanceled: function (uploadInfo, code, message) {
          console.log("Canceled file: " + uploadInfo.file.name + ", code: " + code + ", message:" + message)
          self.statusText = "文件已暂停上传"
        },
        // 文件上传进度，单位：字节, 可以在这个函数中拿到上传进度并显示在页面上
        onUploadProgress: function (uploadInfo, totalSize, progress) {
          console.log(
            "onUploadProgress:file:" +
              uploadInfo.file.name +
              ", fileSize:" +
              totalSize +
              ", percent:" +
              Math.ceil(progress * 100) +
              "%"
          )
          const progressPercent = Math.ceil(progress * 100)
          self.authProgress = progressPercent
          self.statusText = "文件上传中..."
        },
        // 上传凭证超时
        onUploadTokenExpired: function (uploadInfo) {
          // 上传大文件超时, 如果是上传方式一即根据 UploadAuth 上传时
          // 需要根据 uploadInfo.videoId 调用刷新视频上传凭证接口(https://help.aliyun.com/document_detail/55408.html)重新获取 UploadAuth
          // 然后调用 resumeUploadWithAuth 方法, 这里是测试接口, 所以我直接获取了 UploadAuth
          const refreshUrl =
            "https://demo-vod.cn-shanghai.aliyuncs.com/voddemo/RefreshUploadVideo?BusinessType=vodai&TerminalType=pc&DeviceModel=iPhone9,2&UUID=59ECA-4193-4695-94DD-7E1247288&AppVersion=1.0.0&Title=haha1&FileName=xxx.mp4&VideoId=" +
            uploadInfo.videoId
          axios.get(refreshUrl).then(({ data }) => {
            const uploadAuth = data.UploadAuth
            uploader.resumeUploadWithAuth(uploadAuth)
            console.log("upload expired and resume upload with uploadauth " + uploadAuth)
          })
          self.statusText = "文件超时..."
        },
        // 全部文件上传结束
        onUploadEnd: function (uploadInfo) {
          console.log("onUploadEnd: uploaded all the files", uploadInfo)
          self.statusText = "文件上传完毕"
        }
      })
      return uploader
    }
  }
}
</script>

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
