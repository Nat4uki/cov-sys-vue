<!-- 疫情发展预测与展示页面 -->
<template>
    <div class="about">
        <div class="about-map">
            <img :src="img_src" alt="">
            <!-- <h1 >等待更新 或 预测</h1> -->
        </div>

        <div class="about-map__control">
            <header class="about-map__control__title">疫情防控模拟参数</header>
            <hr />

            <div class="about-map__control__item">
                <div class="about-map__control__item__title">密接判定相关参数</div>
                <div class="about-map__control__item__container">
                    <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign"
                        style="max-width: 460px; display: flex; flex-wrap: wrap; justify-content: space-between;">
                        <el-tooltip class="box-item" content="单次管控的密接人数" placement="top">
                            <el-form-item label="管控人数">
                                <div style="margin-top: 20px">
                                    <el-radio-group v-model="netArgument.num_people" @change="printNA">
                                        <el-radio-button v-bind:label="formLabelAlign.num_people[0]"></el-radio-button>
                                        <el-radio-button v-bind:label="formLabelAlign.num_people[1]"></el-radio-button>
                                        <el-radio-button v-bind:label="formLabelAlign.num_people[2]"></el-radio-button>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-tooltip>
                        <el-tooltip class="box-item" content="空间上与患者是否存在空间接触的追溯时长" placement="top">
                            <el-form-item label="追溯时长">
                                <div style="margin-top: 20px">
                                    <el-radio-group v-model="netArgument.retroactive_time" @change="printNA">
                                        <el-radio-button
                                            v-bind:label="formLabelAlign.retroactive_time[0]"></el-radio-button>
                                        <el-radio-button
                                            v-bind:label="formLabelAlign.retroactive_time[1]"></el-radio-button>
                                        <el-radio-button
                                            v-bind:label="formLabelAlign.retroactive_time[2]"></el-radio-button>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-tooltip>
                        <el-tooltip class="box-item" content="经过多长时间进行管控" @change="printNA" placement="top">
                            <el-form-item label="管控延迟">
                                <div style="margin-top: 20px">
                                    <el-radio-group v-model="netArgument.controls_time" @change="printNA">
                                        <el-radio-button v-bind:label="formLabelAlign.controls_time[0]"></el-radio-button>
                                        <el-radio-button v-bind:label="formLabelAlign.controls_time[1]"></el-radio-button>
                                        <el-radio-button v-bind:label="formLabelAlign.controls_time[2]"></el-radio-button>
                                        <el-radio-button v-bind:label="formLabelAlign.controls_time[3]"></el-radio-button>
                                    </el-radio-group>
                                </div>
                            </el-form-item>
                        </el-tooltip>
                    </el-form>
                </div>
            </div>



            <div class="about-map__control__item">
                <el-popover content="SEIR模型转化关系图" placement="top" :width="500">
                    <template #reference>
                        <div class="about-map__control__item__title">SEIR模型相关参数</div>
                    </template>
                    <template #default>
                        <div style="width: 480px;">
                            <img src="../assets/SEIRprediction.jpg" alt="" style="width:100%;">
                        </div>
                    </template>
                </el-popover>
                <div class="about-map__control__item__container">
                    <el-descriptions class="about-map__control__descriptions" :column="4">
                        <el-descriptions-item  label="beta1">{{ formLabelGess.beta1 }}</el-descriptions-item>
                        <el-descriptions-item  label="beta2">{{ formLabelGess.beta2 }}</el-descriptions-item>
                        <el-descriptions-item  label="gamma">{{ formLabelGess.gamma }}</el-descriptions-item>
                        <el-descriptions-item  label="alpha">{{ formLabelGess.alpha }}</el-descriptions-item>
                    </el-descriptions>
                </div>
            </div>

            <div>
                <el-button @click="predictClose" type="primary">预测</el-button>
                <!-- <el-button @click="plotSpread" type="primary">绘制(测试用)</el-button> -->
                <el-button @click="updateState" type="primary">更新</el-button>
                <!-- <el-button @click="getTaskProgress" type="primary">进度（测试用）</el-button> -->
            </div>
            <div class='about-map__control__state'>
                <el-descriptions title="更新执行" :column="1">
                    <el-descriptions-item label="当前进度">{{ taskState }}</el-descriptions-item>
                    <el-descriptions-item label="任务ID">{{ currentTaskId }}</el-descriptions-item>
                </el-descriptions>
                <el-progress :percentage="taskPercentage"></el-progress>
            </div>
        </div>
    </div>
</template>

<script>

import { ref, reactive } from "vue";
import axios from "axios";
//   import { ElButton, ElTransfer } from "element-plus";

//import tarckData from '../mock/trackData.json'

export default {
    setup() {
        // label标签数据填入
        const labelPosition = ref("top");
        // label标签具体数据
        const formLabelAlign = reactive({
            // 管控人数
            num_people: [10, 20, 30],
            // 追溯时长
            retroactive_time: [12, 15, 24],
            // 延迟管控时间
            controls_time: [1, 12, 24, 48],
        });
        const formLabelGess = reactive({
            beta1: '0.9',
            beta2: '0.005',
            gamma: '0.1',
            alpha: '0.01'
        })
        return {
            labelPosition,
            formLabelAlign,
            formLabelGess
        };
    },
    computed: {

    },
    methods: {
        // 发送页面通知函数
        sendNotification(type, titles, msg) {
            // type通知类型；titles通知标题；msg通知信息
            // 根据发送类型进行分支
            // 0 普通通知；1 成功通知；2 出错通知
            if (type == 0) {
                this.$notify.info({ title: titles, message: msg })
            } else if (type == 1) {
                this.$notify({ title: titles, message: msg, type: 'success' });
            } else if (type == 2) {
                this.$notify.error({ title: titles, message: msg });
            }
        },
        // ######################################
        // 初始化预测参数
        initArgument(formData) {
            // 通过绑定的数据加入数据
            formData.append("num_people", this.netArgument.num_people)
            formData.append("retroactive_time", this.netArgument.retroactive_time)
            formData.append("controls_time", this.netArgument.controls_time)
        },
        async predictClose() {
            let data = new FormData()
            this.initArgument(data);
            this.sendNotification(0, "通知", "开始预测")
            // 改为静态数据
            // setTimeout(()=>{
            //     this.sendNotification(1, "通知", "预测成功")
            //     this.plotSpread(data)
            // },3000)
            //实时预测
            axios.post(this.djangoBaseUrl + "predictor/predict/", data)
                .then((response) => {
                    console.log(response.data.result)
                    if (response.data.result == 250) {
                        this.sendNotification(1, "通知", "预测成功")
                        this.plotSpread(data)
                    } else {
                        this.sendNotification(2, "通知", "失败，请重试")
                    }
                })
                .catch((error) => {
                    this.sendNotification(0, "预测错误", error)
                });
        },
        // ########################################
        async plotSpread(data) {
            // let data = new FormData()
            // this.initArgument(data);
            axios.post(this.djangoBaseUrl + "predictor/plot/", data)
                .then((response) => {
                    this.img_src = "http://localhost:8000/" + response.data.img_path
                    // console.log(response.data);
                    // console.log(response.data.img_path);
                })
                .catch((error) => {
                    this.sendNotification(2, "绘图错误", error)
                });
        },
        async updateState() {
            this.printNA();
            let data = new FormData();
            data.append("num_people", this.netArgument.num_people);
            data.append("retroactive_time", this.netArgument.retroactive_time)
            data.append("controls_time", this.netArgument.controls_time)
            console.log(data.get("num_people"), data.get("retroactive_time"), data.get("controls_time"))
            axios.post(this.djangoBaseUrl + "predictor/update/", data)
                .then((response) => {
                    console.log(response.data);
                    if (response.data.state == "ignore") {
                        this.sendNotification(2, "重复执行", "请等待当前更新结束！")
                    } else {
                        this.currentTaskId = response.data.task_id;
                        this.sendNotification(0, "开始更新", "开始更新，请查看进度条")
                        this.getTaskProgress()
                    }
                })
                .catch((error) => {
                    this.sendNotification(2, "更新错误", error);
                    console.log(error);
                });
        },
        async getTaskProgress() {
            const that = this;
            this.timer = setInterval(() => {
                axios.get(that.djangoBaseUrl + "predictor/task_listen/" + that.currentTaskId)
                    .then((response) => {
                        that.taskState = response.data.state;
                        that.taskPercentage = parseInt(response.data.current / response.data.total * 100);
                        if (that.taskState == 'success') {
                            that.sendNotification(1, "更新", "更新成功");
                            clearInterval(that.timer)
                        } else if (that.taskState == 'FAILURE') {
                            that.sendNotification(2, "更新", "更新出错");
                            clearInterval(that.timer)
                        }
                    })
                    .catch((error) => {
                        that.sendNotification(2, "获取进度错误", error);
                        clearInterval(that.timer)
                        // console.log(error);
                    });
            }, 1500)

        },
        printNA() {
            console.log("num_people:" + this.netArgument.num_people
                + "; retroactive_time:" + this.netArgument.retroactive_time
                + "; controls_time:" + this.netArgument.controls_time)
        }
    },
    beforeUnmount() {
        clearInterval(this.timer)
    },
    mounted() {

    },
    watch: {

    },
    data() {
        return {
            djangoBaseUrl: "http://localhost:8000/",
            img_src: " ",
            currentTaskId: " ",
            taskState: "No Running",
            taskPercentage: 0,
            timer: "",
            netArgument: reactive({
                num_people: 10,
                retroactive_time: 12,
                controls_time: 1
            })
        }
    }

};
</script>

<style scoped>
@media (min-width: 1440px) {
    .about-map__control {
        max-height: 700px;
        overflow-x: hidden;
        overflow-y: auto;
    }
}

.about {
    display: flex;
    justify-content: space-around;
    position: relative;
    margin: 2rem 0;
}

.about-map {
    width: 50vw;
    box-shadow: 0.2rem 0.2rem 1rem #999;
    border-radius: 2rem;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.about-map__info {
    display: flex;
    justify-content: space-between;
}

.about-map__info__icon {
    display: flex;
    padding-left: 0;
}

.about-map__info__icon>img {
    margin-left: 0.5rem;
}

.about-map__info__header {
    display: flex;
    align-items: center;
    margin-right: 1rem;
}

.about-map__control__state {
    align-items: center;
    justify-content: space-between;
    margin: 3rem;
}

.about-map__control__descriptions {
    margin: 0 auto;
}

li {
    list-style: none;
    margin-left: 1rem;
}

#container {
    padding: 5px;
    margin: 0px;
    width: 100%;
    height: 100%;
}

.about-map__control {
    position: relative;
    width: 30vw;
    min-width: 600px;
    min-height: 700px;
    box-shadow: 0.2rem 0.2rem 1rem #999;
    border-radius: 2rem;
}

::-webkit-scrollbar {
    width: 0px;
}

.about-map__control::-webkit-scrollbar-track {
    border-radius: 2px;
    background: rgb(239, 239, 239);
}

.about-map__control__title {
    font-weight: 800;
    margin: 16px 0;
}

hr {
    height: 4px;
    border: none;
    background-color: #d8d8d8;
    margin-top: 0;
}

/* 清除button聚样式 */
.about-map__control__button {
    color: #409eff;
    background-color: rgb(236, 245, 255);
}

.about-map__control__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.about-map__control__item__title {
    color: #409eff;
    font-weight: 800;
}

.about-map__control__item__container {
    display: flex;
    width: 80%;
    justify-content: space-between;
    align-items: center;
    padding: 10px 0;
    overflow: auto;
}

.el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
/* 设置组件样式 */
.el-transfer {
    width: 100%;
}

@media (max-width: 1440px) {
    .about {
        flex-direction: column;
        margin: 0;
    }

    .about-map {
        width: 90vw;
        border-radius: 2rem 2rem 0 0;
        height: 60vh;
        margin: 0 auto;
        box-shadow: 0 0.2rem 1rem -0.5rem #999;
    }

    .about-map__control {
        width: 90vw;
        z-index: 10;
        border-radius: 0 0 2rem 2rem;
        box-shadow: 0 0.2rem 1rem -0.5rem #999;
        margin: -56px auto;
    }

    .about-map__control__item {
        flex-direction: row;
        justify-content: space-around;
    }

    .about-map__control__state {
        flex-direction: row;
        justify-content: space-around;
    }

    .el-transfer {
        width: 80%;
        padding-left: 0;
    }
}</style>
