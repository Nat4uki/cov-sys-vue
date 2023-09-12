<!-- 用户数据展示与批量上传页面 -->
<template>
  <div class="container">
    <el-table :data="tableData" style="width: 100%" class="tabel-container" max-height="300px">
      <el-table-column fixed prop="targetId" label="标识" width="200" />
      <el-table-column prop="occupationType" label="职业" width="300" />

      <el-table-column prop="targetSex" label="性别" width="300" />
      <el-table-column prop="targetAge" label="年龄" width="300" />
      <el-table-column prop="personStatues" label="状态" width="300" />
      <el-table-column prop="refreshTime" label="更新时间" width="300" />
    </el-table>
  </div>
  <div class="container">
    <formData @refreshTableData="refreshTable"></formData>
  </div>
  <div class="container">
    <label class="upload-button" for="files">
      上传文件
    </label>
    {{ fileName }}
    <input type="file" id="files" :onchange="fileImport">
    <el-button @click="upLoadFile">确认上传</el-button>
  </div>


</template>

<script>
import formData from './form/dataForm.vue'
import api from "@/api";
import { ref } from "vue";
import { ElMessage } from "element-plus";

export default {
  components:{
    formData
  },
  setup() {
    let tableData = ref([])
    let personStatues = ref([])
    let curData = ref([])
    let fileName = ref("")
    const statuesMap = {1:'易感者', 2:'暴露者', 3:'感染者', 4:'康复者'}
    
    return {
      tableData,
      personStatues,
      curData,
      fileName,
      statuesMap
    }
  },
  methods: {
    fileImport(){
      let file = document.getElementById('files').files[0]
      this.fileName = file.name
    },
    upLoadFile(){
      const path = "D:/A-VUE/DATA/newState/state/" + this.fileName;
      console.log(path);
      api.postUpLoadPath(path).then(res=>{
        const msg = res.data;
        console.log('res',res);

        if(msg.includes('成功')){
          ElMessage({
            message: msg,
            type: "success"
          })
          //更新数据
          this.getTabelData()
        }else{
          ElMessage.error(msg)
        }
        this.fileName = ""
        
      })
      
    },
    handleClick: (e) => {
      console.log(e);
      
    },
    //格式转换
    dataMerge(personState){
      let totalData = [];

      this.tableData.map((item,index)=>{
        let statues = index < personState.length ? this.statuesMap[personState[index].personStatues] : '未知'
        let obj = {...item,...personState[index], personStatues:statues}
        totalData.push(obj)
      })
      this.tableData = totalData;
    },
    async getData() {
      return api.getPersonList().then((res) => {
        return res.data;
      });
    },
    async getStatues(){
      return api.getPersonStatues().then((res) => {
        return res.data
      })
    },
    getTabelData(){
      this.getData().then(v=>{
        this.tableData = v
        this.getStatues().then(v=>{
          this.dataMerge(v);
        })
      })
    },
    refreshTable(){
      this.getTabelData()
    }
  },
  mounted(){
    this.getTabelData()
  }
}
</script>

<style scoped>

.container{
  width: 45vw;
  margin: 40px auto;
  border: 1px solid #d6d6d6;
  border-radius: 5px;
  padding: 20px 20px;
}

.tabel-container{
  margin-bottom: 20px;
}

.upload-button {
  padding: 6px 25px;
  background: #00bfff;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  margin-right: 20px;
 }

input{
  display: none;
}
</style>