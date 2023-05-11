<script lang="ts" setup>
const props = defineProps({
  collapse: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <!-- <transition name="sidebar-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
        <img src="@/assets/layout/logo.png" class="sidebar-logo" />
      </router-link>
      <router-link v-else key="expand" to="/">
        <img src="@/assets/layout/logo-text-1.png" class="sidebar-logo-text" />
      </router-link>
    </transition> -->
    <transition>
      <router-link v-if="props.collapse" key="collapse" to="/">
        <el-text class="fw-700" type="primary">NowGym</el-text>
      </router-link>
      <router-link v-else key="expand" to="/">
        <el-text class="mx-1 fw-700" type="primary">NowGym内容管理后台</el-text>
      </router-link>
    </transition>
  </div>
</template>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: var(--v3-header-height);
  line-height: var(--v3-header-height);
  background-color: var(--v3-sidebarlogo-bg-color);
  text-align: center;
  overflow: hidden;
  .sidebar-logo {
    display: none;
  }
  .sidebar-logo-text {
    height: 100%;
    vertical-align: middle;
  }
}

.collapse {
  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .sidebar-logo-text {
    display: none;
  }
}
</style>
