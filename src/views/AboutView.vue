<!-- 地图容器 -->
<template>
  <div class="about">
    <div class="about-map">
      <div class="about-map__info">
        <ul class="about-map__info__icon">
          <li>
            <img src="../assets/blueIndex.svg" alt="S">
            易感者
          </li>
          <li>
            <img src="../assets/purpelIndex.svg" alt="E">
            潜伏者
          </li>
          <li>
            <img src="../assets/redIndex.svg" alt="I">
            患病者
          </li>
          <li>
          <img src="../assets/greenIndex.svg" alt="R">
            康复者
          </li>
          <li>
            <img src="../assets/yellowIndex.svg" alt="C">
            密接者
          </li>
        </ul>
        <div class="about-map__info__header" >
          当前时间：{{ getCurrentDate }}
        </div>
      </div>
      <div id="container"></div>
    </div>


    <el-collapse v-model="activeNames" @change="handleChange">
      <div class="about-map__control">
        <header class="about-map__control__title">轨迹展示控制器</header>
        <hr>
        
        <ControlMap @sendDate="getDateValue" @sendSliderMsg="getSliderValue" @sendPeopleSelect="getPeopleSelect"/>


        <div class="about-map__control__item">
          <el-collapse-item title="动画控制" name="4" style="max-width:80%">
            <div>
              动画控制用于控制动画的播放，暂停等功能。当动画暂停后可以点击重新播放按钮，重新播放动画。
              刷新按钮可以刷新当前时间的渲染点，当发生点丢失的情况时，可以点击刷新按钮刷新轨迹地图。
            </div>
          </el-collapse-item>
          <div class="about-map__control__item__container">
            <div style="margin-top:20px; width: 100%;">
              <el-button @click="refreshMap" color="#409eff" plain class="about-map__control__button"> 刷新 </el-button>
              <el-button @click="restartAimate" color="#409eff" plain class="about-map__control__button"> {{ isAnimateStop ? '重新播放' : '播放'}} </el-button>
              <el-button @click="stopAnimate" color="#409eff" plain class="about-map__control__button" :disabled="isAnimateStop">暂停</el-button>
            </div>
          </div>
        </div>
        <div class="about-map__control__item">
          <el-collapse-item title="人口密度" name="5" style="max-width:80%">
            <div>
              该功能会根据当前视窗内存在的成员进行统计并根据视窗的地图面积带入人口密度公式内进行计算，结果保留到小数点后三位。
            </div>
          </el-collapse-item>
          <div class="about-map__control__item__container">
            当前人口密度：{{populationDesity == -1 ? '未知' : populationDesity}}
            <el-button @click="caculatePopularDesity" color="#409eff" plain class="about-map__control__button">计算</el-button>
          </div>
        </div>
        <div class="about-map__control__item">
          <el-collapse-item title="成员筛选" name="6" style="max-width:80%">
            <div>
              未选中成员时，地图会展示所有成员轨迹。选中成员时，地图上只会展示已选中成员的轨迹。
            </div>
          </el-collapse-item>
          <div class="about-map__control__item__container el-transfer">
            <el-transfer
              v-model="peopleSelectList"
              filterable
              :filter-method="filterMethod"
              filter-placeholder="搜索"
              :data="peopleList"
              :titles="['可选','已选']"
            />
          </div>
        </div>
      </div>
    </el-collapse>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
import { shallowRef } from "@vue/reactivity";
import api from "@/api";
import { ref } from "vue";
import blueIcon from "../assets/blueIndex.svg";
import redIcon from "../assets/redIndex.svg";
import purpelIcon from "../assets/purpelIndex.svg";
import greenIcon from "../assets/greenIndex.svg";
import yellowIcon from "../assets/yellowIndex.svg";
import ControlMap from "./contorlMapShow/ControlMap.vue";
import { ElButton, ElTransfer } from "element-plus";

//import tarckData from '../mock/trackData.json'

export default {
  components: {
    ControlMap,
    ElButton,
    ElTransfer,
  },
  setup() {
    const amap = shallowRef(null)
    const map = shallowRef(null);
    let mapData = ref([]);
    let totalData = ref(null)
    let mapLayer = ref(null);
    let dateValue = ref([]);
    let sliderValue = ref([0, 0]);
    let timeLock = ref(null);
    let indexInterval = ref(null)
    let mapSize = ref(0);
    let peopleSelect = ref([true,true,true,true,true]);
    let populationDesity = ref(-1);
    let personList = ref([]);
    let peopleList = ref([]);
    let peopleSelectList = ref([]);
    let peopleSelectMap = ref(null);
    let currentTime = ref(0);
    let timeStep = ref(0);
    let isAnimateStop = ref(false);
    let currentMapTime = ref(0);
    const marksMap = [0,5,30,60,900,1800,3600,43200,86400];
    return {
      amap,
      map,
      mapData,
      totalData,
      mapLayer,
      dateValue,
      sliderValue,
      timeLock,
      indexInterval,
      mapSize,
      peopleSelect,
      populationDesity,
      personList,
      peopleList,
      peopleSelectList,
      peopleSelectMap,
      currentTime,
      timeStep,
      marksMap,
      isAnimateStop,
      currentMapTime
    };
  },
  computed:{
    getCurrentDate(){
      if(this.currentMapTime == 0){
        return '暂无'
      }
      //return this.currentTime;
      return this.formatTime(this.currentMapTime)
    }
  },
  methods: {
    debugMarks(){
      console.log('mark',this.mapData);
      console.log('map',this.map);
    },
    async getData() {
      //return tarckData
      return api.getTrackData().then((res) => {
        //console.log(res.data);
        return res.data;
      });
    },
    async getListGisData(list) {
      return api.getPersonGisInList(list).then((res)=>{
        return res.data
      })
    },
    async getPersonList(){
      return api.getPersonList().then(res=>{
        return res.data
      })
    },
    async getDateGisData(start,end){
      return api.getPersonGisInDate(start,end).then((res)=>{
        return res.data;
      })
    },
    refreshMap(){
      this.initMap()
    },
    stopAnimate(){
      if(this.isAnimateStop) return
      if(this.indexInterval) clearInterval(this.indexInterval)
      this.isAnimateStop = true;
      this.currentTime = this.currentTime - this.timeStep*1000;
      console.log(this.formatTime(this.currentTime));
      this.currentMapTime = this.currentTime;
      this.initMap()
    },
    restartAimate(){
      this.isAnimateStop = false;
      this.initMap()
    },
    formatTime(time){
      let date = new Date(time)
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? ('0' + MM) : MM;
      let d = date.getDate();
      d = d < 10 ? ('0' + d) : d;
      let h = date.getHours();
      h = h < 10 ? ('0' + h) : h;
      let m = date.getMinutes();
      m = m < 10 ? ('0' + m) : m;
      let s = date.getSeconds();
      s = s < 10 ? ('0' + s) : s;
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
    },
    clearMarskers(){
      this.mapLayer.remove(this.mapData)
    },
    caculatePopularDesity(){
      let tempBounds = this.map.getBounds();
      let max = tempBounds.getNorthEast().toArray().map(Number);
      let min = tempBounds.getSouthWest().toArray().map(Number);
      let count = 0
      this.mapData.forEach(item => {
        let itemIndex = item._position.map(Number);
        if(itemIndex[0] < max[0] && itemIndex[1] < max[1] && itemIndex[0] > min[0] && itemIndex[1] > min[1]){
          count++
        }
      });
      
      this.caculateMapSize()
      console.log(count,this.mapSize);
      
      this.populationDesity = Math.floor(count/this.mapSize*1000)/1000
    },
    caculateMapSize(){
      let tempBounds = this.map.getBounds();
      let northEast = tempBounds.getNorthEast().toArray();
      let northWest = tempBounds.getNorthWest().toArray();
      let southEast = tempBounds.getSouthEast().toArray();
      let southWest = tempBounds.getSouthWest().toArray();
      
      let area = this.amap.GeometryUtil.ringArea([northEast,northWest,southEast,southWest])
      this.mapSize = (area).toFixed(2)
      return area
    },
    // 地图卡顿请刷新页面
    initMap() {
      AMapLoader.load({
        key: "77378753098fe1a3e5db0943817fc442", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Scale"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.amap = AMap
          const self = this;
          this.map = new AMap.Map("container", {
            //设置地图容器id
            viewMode: "3D", //是否为3D地图模式
            zoom: 12, //初始化地图级别
            //#############################################
            center: [86.080605, 44.306095], //初始化地图中心点位置[120.15, 30.28]
            //#############################################
            mapStyle: "amap://styles/whitesmoke", //减小js堆体积
            showLabel: false,
            showIndoorMap: false,
          });
          this.map.on("complete", async function () {
            self.mapLayer = new AMap.LabelsLayer({
              zooms: [3, 20],
              zindex: 1000,
              collsion: true,
            });
            self.map.add(self.mapLayer);
            self.map.addControl(new AMap.Scale());
            var markers = [];
            
            let iconArr = [blueIcon, purpelIcon, redIcon, greenIcon,yellowIcon];
            let icon = {
              type: "image",
              image: blueIcon,
              size: [9, 9],
              anchor: "bottom-center",
            };

            //初始化防止重复定时器
            clearInterval(self.indexInterval)
            //计算当前地图面积
            //添加坐标点
            const addMasker = async(current, timeStep) => {
              console.time('add marks', current)
              let start = self.formatTime(current)
              
              let end = self.formatTime(current + timeStep)
              console.log('@@time',start,' ',end,' ',timeStep);
              
              let totalData  = await self.getDateGisData(start, end)
              console.log(totalData);
              
                for (let i = 0; i < totalData.length; i++) {
                  let flag = true;
                  if(self.peopleSelectList.length){
                    flag = self.peopleSelectList.includes(totalData[i].personKey);
                  }
                  // 人群选择-过滤不要的类型-过滤超出的时间范围
                  let {personStatus, lng, lat, personKey} = totalData[i]
                  if(flag && self.peopleSelect[personStatus-1]){

                    icon.image = iconArr[personStatus-1];
                    let curData = {
                      position: [lng,lat],
                      icon,
                    };
                    
                    var labelMarker = new AMap.LabelMarker(curData);
                    markers.push(labelMarker);
                    
                    // 给marker绑定事件
                    labelMarker.on("mouseover", function (e) {
                      let position = e.data.data && e.data.data.position;
                      let msg = personKey;
                      if (position) {
                        normalMarker.setContent(
                          '<div class="amap-info-window">' +
                            "ID：" +
                            msg +
                            '<div class="amap-info-sharp"></div>' +
                            "</div>"
                        );
                        normalMarker.setPosition(position);
                        self.map.add(normalMarker);
                      }
                    });

                    labelMarker.on("mouseout", function () {
                      self.map.remove(normalMarker);
                    });
                  } 
                }                

              // 一次性将海量点添加到图层
              self.mapLayer.add(markers);
              //记录数据,统计范围点个数
              self.mapData = markers

              // 普通点
              var normalMarker = new AMap.Marker({
                anchor: "bottom-center",
                offset: [0, -15],
              });
              console.timeEnd('add marks', current);
            };


            // 日期范围
            let startTime = self.dateValue[0];
            let endTime = new Date(self.dateValue[1]).getTime();
            self.currentTime = new Date(startTime).getTime() || 0;
            // 时间间隔步长,该时间内没有数据则不显示
            let timeStep = self.timeStep * 1000;

            // 单点时间
            if(endTime - startTime <= timeStep){
              self.currentMapTime = self.currentTime
            }


            if(timeStep > 0){
              const refreshMarks = () => {
                self.mapLayer.remove(self.mapData)
                markers = []
                addMasker(self.currentMapTime, timeStep);
              }

              if (endTime - startTime > timeStep && !self.isAnimateStop) {
                self.indexInterval = setInterval(()=>{                  
                  if( self.currentTime < endTime){
                    self.mapLayer.clear()
                    markers = []
                    self.currentMapTime = self.currentTime
                    self.currentTime += timeStep
                    addMasker(self.currentMapTime, timeStep)
                  }else{
                    self.stopAnimate()
                  }
                },2000)
              } else {
                refreshMarks();
              }
            }
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getDateValue(dateArr){
        this.dateValue= dateArr;
        console.log(dateArr);
        this.isAnimateStop = false;
        this.initMap();
      //this.getDateGisData(value[0],value[1]);
    },
    getSliderValue(value) {
      //防抖
      if (this.timeLock) {
        clearTimeout(this.timeLock);
      }
      this.timeLock = setTimeout(() => {
        this.timeStep = this.marksMap[value];
        console.log("value is change =>", this.timeStep);
        this.initMap();
      }, 1500);
    },
    getPeopleSelect(value){
      this.peopleSelect = value
      this.initMap()
    },
    filterMethod(query, item){      
      return item.initial.includes(query)
    },
    getPeopleList(data){
      let list = []
      
      data.map((item)=>{
        list.push({
          label: item.targetId,
          key: item.targetId,
          initial: `${item.targetId}`,
        })
      })
      this.peopleList = list
      
    },
    getIdList(start,end){
      let result = []
      for(let i = start; i <= end; i++){
        result.push(1000000+i)
      }
      return result
    }
  },
  mounted() {
    this.totalData = []
    this.initMap();
    this.getPersonList().then(v=>{
      this.getPeopleList(v);
    })

  },
  watch: {
    peopleSelectList(newValue){
      console.log('selected',newValue);
      this.initMap()
    }
  },
  unmounted(){
    clearInterval(this.indexInterval)
  },
  updated() {},
};
</script>

<style scoped>

@media (min-width: 1440px) {
  .about-map__control{
    max-height: 700px;
    overflow-x: hidden;
    overflow-y: auto;
  }
}

.about{
  display: flex;
  justify-content: space-around;
  position: relative;
  margin: 2rem 0;
}

.about-map{
  width: 50vw;
  box-shadow: 0.2rem 0.2rem 1rem #999;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.about-map__info{
  display: flex;
  justify-content: space-between;
}
.about-map__info__icon{
  display: flex;
  padding-left: 0;
}
.about-map__info__icon > img{
  margin-left: 0.5rem;
}
.about-map__info__header{
  display: flex;
  align-items: center;
  margin-right: 1rem;
}

li{
  list-style: none;
  margin-left: 1rem;
}

#container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 100%;
}

.about-map__control{
  position: relative;
  width: 30vw;
  min-width: 600px;
  box-shadow: 0.2rem 0.2rem 1rem #999;
  border-radius: 2rem;
}

::-webkit-scrollbar{
  width: 0px;
  
}

.about-map__control::-webkit-scrollbar-track{
  border-radius: 2px;
  background: rgb(239, 239, 239);
}

.about-map__control__title{
  font-weight: 800;
  margin:16px 0;
}

hr{
  height: 4px;
  border:none;
  background-color: #d8d8d8;
  margin-top: 0;
}

/* 清除button聚样式 */
.about-map__control__button{
  color:#409eff;
  background-color: rgb(236, 245, 255);
}

.about-map__control__item{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.about-map__control__item__title{
  color: #409eff;
  font-weight: 800;

}

.about-map__control__item__container{
  display: flex;
  width: 80%;
  justify-content: space-between;
  align-items: center;
  overflow: auto;
}

/* 设置组件样式 */
.el-transfer{
  width: 100%;    
}

@media (max-width:1440px){
  .about{
    flex-direction: column;
    margin: 0;
  }
  .about-map{
    width: 90vw;
    border-radius: 2rem 2rem 0 0;
    height: 60vh;
    margin: 0 auto;
    box-shadow: 0 0.2rem 1rem -0.5rem #999;
  }
  .about-map__control{
    width: 90vw;
    z-index: 10;
    border-radius: 0 0 2rem 2rem;
    box-shadow: 0 0.2rem 1rem -0.5rem #999;
    margin:-56px auto;
  }
  .about-map__control__item{
    flex-direction: row;
    justify-content: space-around;
  }
  .el-transfer{
    width: 80%;
    padding-left: 0;
  }
}


</style>
