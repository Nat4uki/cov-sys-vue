<template>
  <div class="data-container">
    <div id="container"></div>
    <div id="main"></div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from "vue";
//import treeData from './tree/treeData.vue'

import * as echarts from "echarts/core";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  DatasetComponent,
  GridComponent,
} from "echarts/components";
import { LineChart, PieChart, BarChart } from "echarts/charts";
import { UniversalTransition, LabelLayout } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import api from "@/api";

echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
  LineChart,
  DatasetComponent,
  GridComponent,
  BarChart,
]);

let stateResource = reactive([]);
let containerResource = reactive([]);
let covSumState;

const updateState = (data) => {
  let dataTitle = [["product"], ["易感者"], ["潜伏者"], ["感染者"], ["康复者"],["密接者"]];
  console.log("data", data);

  data.map((item, index) => {
    dataTitle[0].push(`${index + 1}`);
    dataTitle[1].push(item.stype);
    dataTitle[2].push(item.etype);
    dataTitle[3].push(item.itype);
    dataTitle[4].push(item.rtype);
    dataTitle[5].push(item.ctype);
  });
  stateResource = dataTitle;
  console.log(stateResource);
};

function initMainMap() {
  var chartDom = document.getElementById("main");
  var myChart = echarts.init(chartDom);

  let option = {
    title: {
      text: "过去一周疫情数据",
      left: "center",
    },
    //  legend: {},
    tooltip: {
      trigger: "axis",
      showContent: false,
    },
    dataset: {
      source: stateResource,
    },
    xAxis: { type: "category" },
    yAxis: { gridIndex: 0 },
    grid: { top: "55%" },
    series: [
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },{
        type: "line",
        smooth: true,
        seriesLayoutBy: "row",
        emphasis: { focus: "series" },
      },
      {
        type: "pie",
        id: "pie",
        radius: "30%",
        center: ["50%", "25%"],
        emphasis: {
          focus: "self",
        },
        label: {
          formatter: "{b}: {@1} ({d}%)",
        },
        encode: {
          itemName: "product",
          value: "1",
          tooltip: "1",
        },
      },
    ],
  };
  myChart.on("updateAxisPointer", function (event) {
    const xAxisInfo = event.axesInfo[0];
    if (xAxisInfo) {
      const dimension = xAxisInfo.value + 1;
      myChart.setOption({
        series: {
          id: "pie",
          label: {
            formatter: "{b}: {@[" + dimension + "]} ({d}%)",
          },
          encode: {
            value: dimension,
            tooltip: dimension,
          },
        },
      });
    }
  });
  myChart.setOption(option);
}

function initContainerMap() {
  //console.log("initContainerMap");
  var myChart = echarts.init(document.getElementById("container"));
  var option = {
    legend: {},
    tooltip: {},
    dataset: {
      source: containerResource,
    },
    xAxis: [
      { type: "category", gridIndex: 0 },
      { type: "category", gridIndex: 1, axisLabel: { interval: 0, rotate: 0 } },
    ],
    yAxis: [{ gridIndex: 0 }, { gridIndex: 1 }],
    grid: [{ bottom: "55%" }, { top: "55%" }],
    series: [],
  };
  let result = [];
  for(let i = 0; i < containerResource.length; i++){
    if(i === 0){
      for(let j = 1; j < containerResource[0].length; j++){
        result.push({ type: "bar", xAxisIndex: 1, yAxisIndex: 1 })
      }
    }else{
      result.unshift({ type: "bar", seriesLayoutBy: "row" })
    }
  }
  option.series = result
  option && myChart.setOption(option);
}

onMounted(() => {
  //console.log("s1");

  // 问题记录：图表无法渲染
  // 排查： 事件循环，promise。最后执行
  // 解决方案：使用·
  api.getCovSumState().then((res) => {
    covSumState = res.data;
    if (covSumState.length >= 7) {
      updateState(covSumState.slice(-7));
    } else {
      updateState(covSumState);
    }
    initMainMap();
  });


  // 职业与seir数量关系
  api.getPersonList().then((res1) => {
    let personList = res1.data;
    api.getPersonStatues().then((res2) => {
      let personStatues = res2.data;
      let jobObj = {};
      personList.map((item, index) => {
        const occupation = item.occupationType;
        const person = personStatues[index];
        if(!person) return;
        // 职业不存在则创建
        if (!jobObj[occupation]) {
          // 存放seir类型数量
          jobObj[occupation] = [occupation, 0, 0, 0, 0, 0];
        }
        if (item.personKey === person.targetId && person.personStatues) {
          jobObj[occupation][personStatues[index].personStatues]++;
        }
      });
      // 取成数组
      let result = Object.values(jobObj);
      // 插入title
      result.unshift(["product", "易感者", "潜伏者", "患病者", "康复者","密接者"]);
      containerResource = result;
      initContainerMap();
    });
  });

});
</script>
<style scoped>
.data-container {
  margin-top: 80px;
  display: flex;
}
#container {
  height: 600px;
  width: 1800px;
}
#main {
  height: 600px;
  width: 1000px;
}
</style>
