<!-- 信息录入页面 -->
<template>
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="基本信息录入" name="first">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
        :size="formSize"
        label-position="left"
        status-icon
      >
        <el-form-item label="ID" prop="targetId">
          <el-col :span="11">
            <el-input v-model="ruleForm.targetId" />
          </el-col>
          <el-col class="text-center" :span="2">
            <span class="text-gray-500">&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="年龄" prop="targetAge" required>
              <el-select-v2 v-model="ruleForm.targetAge" :options="ageArea" />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="职业" prop="occupationType">
          <el-col :span="11">
            <el-input v-model="ruleForm.occupationType" />
          </el-col>
          <el-col class="text-center" :span="2">
            <span class="text-gray-500">&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="性别" prop="targetSex" required>
              <el-select-v2 v-model="ruleForm.targetSex" :options="sexOptions" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            提交
          </el-button>
          <el-button @click="resetForm(ruleFormRef)" class="reset-btn"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="轨迹数据录入" name="second">
      <el-form
        ref="stateRuleFormRef"
        :model="stateRuleForm"
        :rules="stateRules"
        label-width="70px"
        class="demo-ruleForm"
        :size="formSize"
        label-position="left"
        status-icon
      >
        <el-form-item label="ID" prop="personKey" required>
          <el-col :span="11">
            <el-input v-model="stateRuleForm.personKey"/>
          </el-col>
          <el-col class="text-center" :span="2">
            <span class="text-gray-500">&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="时间" prop="indexTime" required>
              <el-date-picker
                v-model="stateRuleForm.indexTime"
                type="datetime"
                label="选择时间"
                placeholder="请选择时间"
                style="width: 100%"
                @change="onPickDate"
                :default-value="defaultTime"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-form-item>

        <el-form-item label="经度" prop="lng">
          <el-col :span="11">
            <el-input v-model="stateRuleForm.lng" />
          </el-col>
          <el-col class="text-center" :span="2">
            <span class="text-gray-500">&nbsp;</span>
          </el-col>
          <el-col :span="11">
            <el-form-item label="纬度" prop="lat" required>
              <el-input v-model="stateRuleForm.lat" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="类型" prop="personStatus">
          <el-radio-group v-model="stateRuleForm.personStatus">
            <el-radio :label=1>易感</el-radio>
            <el-radio :label=2>潜伏</el-radio>
            <el-radio :label=3>感染</el-radio>
            <el-radio :label=4>康复</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(stateRuleFormRef)">
            提交
          </el-button>
          <el-button @click="resetForm(stateRuleFormRef)" class="reset-btn"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="数据删除" name="third">
      <el-form
        ref="deleteRuleFormRef"
        :model="deleteRuleForm"
        :rules="deleteRules"
        label-width="100px"
        class="demo-ruleForm"
        :size="formSize"
        label-position="left"
        status-icon
      >
        <el-form-item label="ID" prop="personKey">
            <el-col :span="11">
              <el-input v-model="deleteRuleForm.personKey" />
            </el-col>
            <el-col class="text-center" :span="2">
              <span class="text-gray-500">&nbsp;</span>
            </el-col>
            <el-col :span="11">
              <el-form-item label="数据类型" prop="personStatus" required>

                  <el-radio-group v-model="deleteRuleForm.personStatus">
                    <el-radio :label=0>删除成员轨迹数据</el-radio>
                    <el-radio :label=1>删除成员</el-radio>
                  </el-radio-group>

              </el-form-item>
            </el-col>
          </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dialogVisible = true">
            删除
          </el-button>
          <el-button @click="resetForm(deleteRuleFormRef)" class="reset-btn"
            >重置</el-button
          >
        </el-form-item>
        <el-dialog
          v-model="dialogVisible"
          title="提示"
          width="30%"
        >
          <span>请确认是否要删除数据</span>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="submitForm(deleteRuleFormRef)">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </el-form>
    </el-tab-pane>
  </el-tabs>

</template>

<script>
import { reactive, ref } from "vue";
import api from "../../api"
import { ElMessage } from "element-plus";
export default {
  setup() {
    // tabs
    const activeName = ref("first");

    const formSize = ref("default");
    const ruleFormRef = ref();
    // 基本信息录入
    const ruleForm = reactive({
      targetId: "",
      targetSex: "",
      targetAge: "",
      occupationType: "",
    });

    const rules = reactive({
      targetId: [
        { required: true, message: "请入输入ID", trigger: "blur" },
        { min: 7, max: 7, message: "请输入正确的ID", trigger: "blur" },
      ],
      targetAge: [
        {
          required: true,
          message: "请选择年龄",
          trigger: "change",
        },
      ],
      targetSex: [
        {
          required: true,
          message: "请选择性别",
          trigger: "change",
        },
      ],
      occupationType: [
        {
          required: true,
          message: "请输入职业",
          trigger: "change",
        },
      ],
    });

    // 状态录入
    const stateRuleFormRef = ref();
    const stateRuleForm = reactive({
      personKey: null,
      indexTime: "",
      lng: "",
      lat: "",
      personStatus: "",
    });

    const stateRules = reactive({
      personKey: [
        { required: true, message: "请入输入ID", trigger: "blur" },
        { min: 7, max: 7, message: "请输入正确的ID", trigger: "blur" },
      ],
      indexTime: [
        {
          type: "date",
          required: true,
          message: "请选择时间",
          trigger: "change",
        },
      ],
      personStatus: [
        {
          required: true,
          message: "请选择状态",
          trigger: "change",
        },
      ],
      lng: [
        {
          required: true,
          message: "请输入经度",
          trigger: "change",
        },
        { pattern: /^(?:-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,})?|180(?:\.0{1,6})?)$/, message: "请输入正确的经度", trigger: "blur" },
      ],
      lat: [
        {
          required: true,
          message: "请输入维度",
          trigger: "change",
        },
        { pattern: /^(?:-?[1-8]?\d(?:\.\d{1,})?|90(?:\.0{1,6})?)$/, message: "请输入正确的纬度", trigger: "blur" },
      ],
    });

    const sexOptions = [
      { value: "M", label: "男" },
      { value: "FM", label: "女" },
    ];
    const ageArea = Array.from({ length: 150 }).map((_, idx) => ({
      value: `${idx}`,
      label: `${idx}`,
    }));

    // 数据删除
    const deleteRuleFormRef = ref();
    const deleteRuleForm = reactive({
      personKey: null,
      personStatus: "",
    });

    const deleteRules = reactive({
      personKey: [
        { required: true, message: "请入输入ID", trigger: "blur" },
        { min: 7, max: 7, message: "请输入正确的ID", trigger: "blur" },
      ],
      personStatus: [
        {
          required: true,
          message: "请选择状态",
          trigger: "change",
        },
      ]
    });

    const dialogVisible = ref(false)

    const defaultTime = new Date(2022, 2, 1, 0, 0, 0)
    return {
      formSize,
      ruleFormRef,
      ruleForm,
      rules,
      sexOptions,
      ageArea,
      activeName,
      stateRuleForm,
      stateRules,
      stateRuleFormRef,
      defaultTime,
      deleteRuleFormRef,
      deleteRuleForm,
      deleteRules,
      dialogVisible
    };
  },
  emits:[
    'refreshTableData'
  ],
  methods: {
    async postForm(){
      if(this.activeName === 'first'){
        console.log('subitData',JSON.stringify(this.ruleForm));
        return api.addCovPerson(this.ruleForm).then(v => {
          return v.data
        })
      }else if(this.activeName === 'second'){
        console.log('subitData',JSON.stringify(this.stateRuleForm));
        return api.addCovPersonGis(this.stateRuleForm).then(v => {
          return v.data
        })
      }else if(this.activeName === 'third'){
        return api.deleteCovData(this.deleteRuleForm).then(v => {
          return v.data
        })
      }
      return "非法提交"

    },
    async submitForm(formEl){
      this.dialogVisible = false;
      console.log('form',JSON.stringify(formEl));
      
      if (!formEl) return;
      await formEl.validate(async (valid, fields) => {
        if (valid) {
          let result = await this.postForm();
          //const result = toRaw(this.ruleForm);
          //console.log(result);
          this.openDialog(result);
          this.resetForm(formEl);
          this.$emit("refreshTableData")
        } else {
          this.openDialog('请检查数据格式是否正确');
          console.log("error submit!", fields);
        }
      });
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
    onPickDate(){
      this.stateRuleForm.indexTime = this.formatTime(this.stateRuleForm.indexTime);
    },
    openDialog(msg){
      if(msg.includes('成功')){
        ElMessage({
          message: msg,
          type: "success"
        })
      }else{
        ElMessage.error(msg)
      }
    },
    resetForm: (formEl) => {
      if (!formEl) return;
      formEl.resetFields();
    },
    logData: (data) => {
      console.log(data);
    },
    handleClick(e) {
      console.log(e);
    },
  },
};
</script>

<style scoped>
.reset-btn {
  margin-right: 10px;
}
</style>
