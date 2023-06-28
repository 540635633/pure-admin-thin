<script setup lang="ts">
import { onMounted, reactive, ref, UnwrapRef, toRefs, onUpdated } from "vue";
import { updateGroupLog, getGroupLogList } from "@/api/groupLog";
import { cloneDeep } from "@pureadmin/utils";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { removeWatermark } from "@/utils/removeWatermark";

const props = defineProps({
  //子组件接收父组件传递过来的值
  templateActionId: String,
  templateLogId: String
});

//使用父组件传递过来的值
const { templateActionId, templateLogId } = toRefs(props);
console.log("5457 ", templateLogId.value);
const groupLogList = ref<any>([]);
//编辑数据
const editableData: UnwrapRef<Record<string, any>> = reactive({});
//表单列
const columns = [
  {
    title: "实际次数",
    dataIndex: "actualTimes"
  },
  {
    title: "期望次数",
    dataIndex: "expectTimes"
  },
  {
    title: "期望重量",
    dataIndex: "expectWeight"
  }
];

onMounted(() => {
  getGroupLogListData();
});

onUpdated(() => {
  removeWatermark();
});

//获取组动作列表
const getGroupLogListData = async () => {
  try {
    const { data } = await getGroupLogList({
      templateActionId: templateActionId.value,
      templateLogId: templateLogId.value
    });
    groupLogList.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {}, 500);
  }
};
//保存时调用
const updateGroupLogData = async (key: string) => {
  Object.assign(
    groupLogList.value.filter(item => key === item.key)[0],
    editableData[key]
  );
  delete editableData[key];
  groupLogList.value = [].concat(groupLogList.value);
  await updateGroupLog(groupLogList.value.filter(item => key === item.key)[0]);
  await getGroupLogListData();
};
//单元格编辑前调用
const beforeEdit = (key: string) => {
  editableData[key] = cloneDeep(
    groupLogList.value.filter(item => key === item.key)[0]
  );
};
</script>

<template>
  <s-table
    v-if="groupLogList[0]"
    bordered
    :data-source="groupLogList"
    :columns="columns"
    :pagination="false"
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="column.dataIndex === 'expectTimes'">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ text || " " }}
          </div>
        </div>
      </template>
      <template v-if="column.dataIndex === 'actualTimes'">
        <div class="editable-cell">
          <div
            v-if="editableData[record.key]"
            class="editable-cell-input-wrapper"
          >
            <el-input-number
              v-model="editableData[record.key].actualTimes"
              placeholder="Please input"
            />
            <check-outlined
              class="editable-cell-icon-check"
              @click="updateGroupLogData(record.key)"
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
      <template v-if="column.dataIndex === 'expectWeight'">
        <div class="editable-cell">
          <div class="editable-cell-text-wrapper">
            {{ text || " " }}
          </div>
        </div>
      </template>
    </template>
  </s-table>
</template>

<style scoped lang="scss">
@import url("@/style/table.scss");
</style>
