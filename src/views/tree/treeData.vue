<template>
  <div class="app-container">
    <el-input
      v-model="filterText"
      placeholder="搜索"
      style="margin-bottom: 30px"
    />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>

<script>
import { ElTree } from "element-plus";
export default {
    components:{
        ElTree
    },
  data() {
    return {
      filterText: "",
      data2: [
        {
          id: 1,
          label: "浙江省",
          children: [
            {
              id: 2,
              label: "杭州市",
              children: [
                {
                    id: 3,
                    label: "感染患者：25人",
                },
                {
                    id: 3,
                    label: "密接人员：18人",
                },
                {
                    id: 3,
                    label: "健康人群：20人",
                }
              ],
            },
          ],
        }
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    },
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
};
</script>
