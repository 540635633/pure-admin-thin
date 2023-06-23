<script setup lang="ts">
import {
  getTemplateActionList,
  updateTemplateAction
} from "@/api/templateAction";
import { onMounted, onUpdated, reactive, ref, toRefs, UnwrapRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { getInstrumentOptions } from "@/api/instrument";
import { getPartOptions } from "@/api/part";
import { dict } from "@/utils/dict";
import { removeWatermark } from "@/utils/removeWatermark";
import Group from "@/views/gym/template/components/group.vue";
import { addGroup } from "@/api/group";

const props = defineProps({
  //子组件接收父组件传递过来的值
  templateId: String
});

//使用父组件传递过来的值
const { templateId } = toRefs(props);

const templateActionList = ref<any>([]);

//部位下拉
const partOptions = ref<any>([]);
//器械下拉
const instrumentOptions = ref<any>([]);
//编辑数据
const editableData: UnwrapRef<Record<string, any>> = reactive({});
//表单列
const columns = [
  {
    title: "动作序号",
    dataIndex: "sortOrder",
    width: "17%",
    autoHeight: true
  },
  {
    title: "动作",
    dataIndex: "name",
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
  },
  {
    title: "操作",
    dataIndex: "operation"
  }
];
//初始化
onMounted(() => {
  getTemplateActionListData();
  getInstrumentOptionsData();
  getPartOptionsData();
});

onUpdated(() => {
  removeWatermark();
});
//获取模板动作列表
const getTemplateActionListData = async () => {
  try {
    const { data } = await getTemplateActionList(templateId.value);
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
//保存时调用
const updateActionData = async (key: string) => {
  Object.assign(
    templateActionList.value.filter(item => key === item.key)[0],
    editableData[key]
  );
  delete editableData[key];
  templateActionList.value = [].concat(templateActionList.value);
  await updateTemplateAction(
    templateActionList.value.filter(item => key === item.key)[0]
  );
  await getTemplateActionListData();
};
//单元格编辑前调用
const beforeEdit = (key: string) => {
  editableData[key] = cloneDeep(
    templateActionList.value.filter(item => key === item.key)[0]
  );
};

const addGroupData = async (key: any) => {
  await addGroup({ key });
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
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'sortOrder'">
        <div class="editable-cell">
          <div
            v-if="editableData[record.key]"
            class="editable-cell-input-wrapper"
          >
            <el-input-number
              v-model="editableData[record.key].sortOrder"
              placeholder="Please input"
            />
            <check-outlined
              class="editable-cell-icon-check"
              @click="updateActionData(record.key)"
            />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            {{ text || " " }}
            <edit-outlined
              class="editable-cell-icon"
              @click="beforeEdit(record.key)"
            />
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
      <template v-else-if="column.dataIndex === 'operation'">
        <el-button type="primary" text @click="addGroupData(record.key)"
          >新增组
        </el-button>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <group :templateActionId="record.key" />
    </template>
  </s-table>
</template>

<style scoped lang="less">
@import url("@/style/table.scss");
</style>
