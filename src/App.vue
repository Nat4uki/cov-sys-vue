<template>
  <nav>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      style="margin: 0 70px;"
    >
      <el-menu-item index="0">疫情防控管理可视化系统</el-menu-item>
      <div class="flex-grow" ></div>
      <el-menu-item index="1">
        <router-link to="/home" style="text-decoration: none;">数据管理</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link to="/about" style="text-decoration: none;">疫情轨迹地图</router-link>
      </el-menu-item>
      <el-menu-item index="3">
        <router-link to="/mapDetailSet" style="text-decoration: none;">疫情防控模拟</router-link>
      </el-menu-item>
      <el-menu-item index="4">
        <router-link to="/data" style="text-decoration: none;">人群统计属性</router-link>
      </el-menu-item>
    </el-menu>
  </nav>
  <router-view/>
</template>

<script setup>
import { ref } from 'vue'

const activeIndex = ref('0')


</script>

<style>
.flex-grow {
  flex-grow: 1;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
/* 去除水印 */
.amap-logo{
  display: none;
  visibility: hidden;

}
.amap-copyright{
  display: none;
  visibility: hidden;
  opacity: 0;
}

/* 去除折叠面板样式 */
.el-collapse-item__header{
  font-size: 16px !important;
  color: #409eff !important;
  font-weight: 900 !important;
  border: none !important;
  padding: 0 !important;
}

.el-collapse-item__wrap{
  border: none !important;
}

</style>
