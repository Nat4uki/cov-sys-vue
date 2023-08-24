<template>

  <div class="slider-demo-block">
    <el-collapse-item title="时间段控制器" name="1" class="slider-title">
      <div>
        时间段控制器用于选择展示动画效果的时间范围，对于无数据的时间端将会禁用不可选取。注意选取时间段后还需要选择时间粒度才可播放动画。
      </div>
    </el-collapse-item>
    <div class="date-select">
      <el-date-picker
        v-model="value8"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-value="defaultDate"
        @change="onPickDate"
        :disabledDate="disabledDate"
        format="YYYY-MM-DD HH:mm:ss"
      >
      </el-date-picker>
    </div>
  </div>
  <div class="slider-demo-block" >
    <el-collapse-item title="时间粒度控制器" name="2" class="slider-title">
      <div>
        时间粒度控制器用于控制动画播放每一帧的时间跨度，如果时间跨度大于所选时间段，则会以图的形式渲染一次并取最近的时间点进行渲染。
      </div>
    </el-collapse-item>
    <el-slider v-model="sliderValue" :max="8" :show-tooltip="false" :marks="marks" style="margin-bottom: 20px;"/>
  </div>

  <div class="slider-demo-block">
    <el-collapse-item title="SEIR类型筛选" name="3" class="slider-title">
      <div>
        四个开关分别对应易感者、潜伏者、患病者、康复者四种类型的人群，可以通过开关控制是否显示该类型的人群，四个开关相互独立。
      </div>
    </el-collapse-item>
    <ul class="people-select">
      <li>
        易感者
        <el-switch @click="logMsg" v-model="trackDataSelect[0]" class="ml-2" />
      </li>
      <li>
        潜伏者
        <el-switch v-model="trackDataSelect[1]" class="ml-2" />
      </li>
      <li>
        患病者
        <el-switch v-model="trackDataSelect[2]" class="ml-2" />
      </li>
      <li>
        康复者
        <el-switch v-model="trackDataSelect[3]" class="ml-2" />
      </li>
      <li>
        密接者
        <el-switch v-model="trackDataSelect[4]" class="ml-2" />
      </li>
    </ul>
  </div>
</template>

<script>
import { ref,reactive } from 'vue'
import { ElSlider, ElSwitch, ElButton } from 'element-plus';
import store from '@/store';

export default{
  componens:{
    ElSlider,
    ElSwitch,
    ElButton,
  },
  emits:[
    'sendSliderMsg',
    'sendPeopleSelect',
    'sendDate'
  ],
  setup() {
    let storeSliderValue = store.state.sliderValue
    const sliderValue = ref(storeSliderValue);  
    let trackDataSelect = reactive([true,true,true,true,true])
    let populationDesity = ref(0)
//    let defaultDate = new Date("2022-03-01");
    let value8 = ref(0)
    let defaultDate = ref([
      new Date(2022, 2, 1, 0, 0, 0),
      new Date(2022, 2, 1, 0, 0, 0)
    ])
    const marks = reactive({
      0: '未设置',
      1: '5秒',
      2: '30秒',
      3: '一分钟',
      4: '十五分钟',
      5: '半小时',
      6: '一小时',
      7: '半天',
      8: '一天'
    })
    return {
      sliderValue,
      trackDataSelect,
      populationDesity,
      value8,
      defaultDate,
      marks
    }
  },
  watch:{
    sliderValue(newValue){
      //store.dispatch('sliderValue',newValue)
      this.$emit('sendSliderMsg',newValue)
    },
    trackDataSelect:{
      deep:true,
      handler:function(newValue){
        this.$emit('sendPeopleSelect',newValue)
        console.log('send to map New value:'+newValue);
      }
    }
  },
  methods: {
    logMsg(){
      console.log(this.trackDataSelect);
    },
    disabledDate(time){
      let start = new Date("2022-02-28")
      let end = new Date("2022-03-9")
      let now = time.getTime()
      return (now > end || now < start)
    },
    onPickDate(dateObj){
      this.$emit('sendDate',dateObj)
    }
  },
  
}

</script>
<style scoped>

@media (min-width: 1440px) {
  .slider-demo-block {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
}
.slider-demo-block {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.slider-demo-block .el-slider {
  margin-top: 0;
  margin-left: 12px;
  width: 80%;
}

.slider-title {
  color: #666;
  max-width: 80%;
}

li{
  list-style: none;
  display: flex;
  justify-content: space-between;
}

.people-select{
  padding: 0;
  width: 80%;
}
.date-select{
  width: 80%;
  display: flex;
  justify-content: space-between;
}

</style>