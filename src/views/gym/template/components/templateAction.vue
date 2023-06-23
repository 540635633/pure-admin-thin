<script setup lang="ts">
import {
  getTemplateActionList,
  updateTemplateAction
} from "@/api/templateAction";
import {onMounted, onUpdated, reactive, ref, toRefs, UnwrapRef} from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { getInstrumentOptions } from "@/api/instrument";
import { getPartOptions } from "@/api/part";
import { dict } from "@/utils/dict";
import {removeWatermark} from "@/utils/removeWatermark";

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
    title: "序号",
    dataIndex: "sortOrder",
    width: "30%",
    autoHeight: true
  },
  {
    title: "动作",
    dataIndex: "name",
    width: "30%",
    autoHeight: true
  },
  {
    title: "器械",
    dataIndex: "instrumentId"
  },
  {
    title: "部位",
    dataIndex: "partIds"
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
//批量删除
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
//编辑前时调用
const beforeEdit = (key: string) => {
  editableData[key] = cloneDeep(
    templateActionList.value.filter(item => key === item.key)[0]
  );
};
</script>

<template>
  <el-card v-if="templateActionList[0]" class="box-card">
    <s-table
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
      </template>
    </s-table>
  </el-card>
</template>

<style scoped lang="less">
@import url("@/style/table.scss");
</style>
