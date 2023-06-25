<script setup lang="ts">
import {
  deleteTemplateAction,
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
import { number } from "vue-types";
import { getActionOptions } from "@/api/action";

const props = defineProps({
  //子组件接收父组件传递过来的值
  templateId: String,
  version: number
});

//通知子组件渲染
const currentTime = ref();

// 定义发射给父组件的方法
const emits = defineEmits(["render"]);

//使用父组件传递过来的值
const { templateId, version } = toRefs(props);

const templateActionList = ref<any>([]);

//动作下拉
const actionOptions = ref<any>([]);
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
    dataIndex: "actionId",
    autoHeight: true
  },
  {
    title: "器械",
    dataIndex: "instrumentId"
  },
  {
    title: "部位",
    width: "30%",
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
  getActionOptionsData();
});

onUpdated(() => {
  removeWatermark();
});

const getTime = () => {
  const now = new Date();
  currentTime.value = now.getTime();
};

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
    //告诉父组件重新渲染
    emits("render", "render");
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
const updateTemplateActionData = async (key: string) => {
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
  await addGroup({ key, version });
  getTime();
};

const deleteTemplateActionData = async (key: any) => {
  await deleteTemplateAction({ key });
  await getTemplateActionList();
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
              @click="updateTemplateActionData(record.key)"
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
      <template v-if="column.dataIndex === 'actionId'">
        <div class="editable-cell">
          <div
            v-if="editableData[record.key]"
            class="editable-cell-input-wrapper"
          >
            <el-select
              v-model="editableData[record.key].actionId"
              style="width: 100%"
              collapse-tags-tooltip
              placeholder="Select"
              @pressEnter="updateTemplateActionData(record.key)"
            >
              <el-option
                v-for="item in actionOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <check-outlined
              class="editable-cell-icon-check"
              @click="updateTemplateActionData(record.key)"
            />
          </div>
          <div v-else class="editable-cell-text-wrapper">
            <el-tag class="mx-1" v-if="text">
              {{ dict(actionOptions, text) }}
            </el-tag>
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
        <el-button
          type="primary"
          text
          @click="deleteTemplateActionData(record.key)"
          >删除
        </el-button>
      </template>
    </template>
    <template #expandedRowRender="{ record }">
      <group :key="currentTime" :templateActionId="record.key" />
    </template>
  </s-table>
</template>

<style scoped lang="less">
@import url("@/style/table.scss");
</style>
