<script setup lang="ts">
import { getTemplateActionList } from "@/api/templateAction";
import { onMounted, onUpdated, ref, toRefs } from "vue";
import { getInstrumentOptions } from "@/api/instrument";
import { getPartOptions } from "@/api/part";
import { dict } from "@/utils/dict";
import { removeWatermark } from "@/utils/removeWatermark";
import GroupLog from "@/views/gym/templateLog/components/groupLog.vue";
import {Template} from "@/api/template";
import {getActionOptions} from "@/api/action";
import {CheckOutlined, EditOutlined} from "@ant-design/icons-vue";

const props = defineProps({
  //子组件接收父组件传递过来的值
  templateId: String,
  version: String
});
//动作下拉
const actionOptions = ref<any>([]);
//使用父组件传递过来的值
const { templateId, version } = toRefs(props);

const templateActionList = ref<any>([]);

//部位下拉
const partOptions = ref<any>([]);
//器械下拉
const instrumentOptions = ref<any>([]);
//表单列
const columns = [
  {
    title: "动作",
    dataIndex: "actionId",
    autoHeight: true
  },
  {
    title: "器械",
    dataIndex: "instrumentId"
  },
  {
    title: "部位",
    width: "40%",
    dataIndex: "partIds"
  }
];
//初始化
onMounted(() => {
  getTemplateActionListData();
  getInstrumentOptionsData();
  getPartOptionsData();
  getActionOptionsData();
});

onUpdated(() => {
  removeWatermark();
});
//获取动作下拉
const getActionOptionsData = async () => {
  try {
    const { data } = await getActionOptions();
    actionOptions.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      //dataLoading.value = false;
    }, 500);
  }
};
//获取模板动作列表
const getTemplateActionListData = async () => {
  try {
    const { data } = await getTemplateActionList({
      templateId: templateId.value,
      version: version.value
    });
    templateActionList.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {}, 500);
  }
};
//获取器械下拉
const getInstrumentOptionsData = async () => {
  try {
    const { data } = await getInstrumentOptions();
    instrumentOptions.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      //dataLoading.value = false;
    }, 500);
  }
};
//获取部位下拉
const getPartOptionsData = async () => {
  try {
    const { data } = await getPartOptions();
    partOptions.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      //dataLoading.value = false;
    }, 500);
  }
};
</script>

<template style="background: #1b2a47">
  <s-table
    v-if="templateActionList[0]"
    bordered
    :data-source="templateActionList"
    :columns="columns"
    :pagination="false"
  >
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'actionId'">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            <el-tag class="mx-1" v-if="text">
              {{ dict(actionOptions, text) }}
            </el-tag>
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'instrumentId'">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            <el-tag class="mx-1" v-if="text">
              {{ dict(instrumentOptions, text) }}
            </el-tag>
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'partIds'">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            <el-tag class="mx-1" v-for="key in text" :key="key">
              {{ dict(partOptions, key) }}
            </el-tag>
          </div>
        </div>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <group-log :templateActionId="record.key" />
    </template>
  </s-table>
</template>

<style scoped lang="less">
@import url("@/style/table.scss");
</style>
