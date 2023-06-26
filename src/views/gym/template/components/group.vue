<script setup lang="ts">
import { onMounted, reactive, ref, UnwrapRef, toRefs, onUpdated } from "vue";
import { updateGroup, getGroupList, deleteGroup, copyGroup } from "@/api/group";
import { cloneDeep } from "@pureadmin/utils";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { removeWatermark } from "@/utils/removeWatermark";

const props = defineProps({
  //子组件接收父组件传递过来的值
  templateActionId: String
});

//使用父组件传递过来的值
const { templateActionId } = toRefs(props);

const groupList = ref<any>([]);
//编辑数据
const editableData: UnwrapRef<Record<string, any>> = reactive({});
//表单列
const columns = [
  {
    title: "组序号",
    dataIndex: "sortOrder",
    width: "30%",
    autoHeight: true
  },
  {
    title: "期望次数",
    dataIndex: "expectTimes"
  },
  {
    title: "期望重量",
    dataIndex: "expectWeight"
  },
  {
    title: "操作",
    dataIndex: "operation"
  }
];

onMounted(() => {
  getGroupListData();
});

onUpdated(() => {
  removeWatermark();
});

//获取组动作列表
const getGroupListData = async () => {
  try {
    const { data } = await getGroupList(templateActionId.value);
    groupList.value = data;
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {}, 500);
  }
};
//保存时调用
const updateGroupData = async (key: string) => {
  Object.assign(
    groupList.value.filter(item => key === item.key)[0],
    editableData[key]
  );
  delete editableData[key];
  groupList.value = [].concat(groupList.value);
  await updateGroup(groupList.value.filter(item => key === item.key)[0]);
  await getGroupListData();
};
//单元格编辑前调用
const beforeEdit = (key: string) => {
  editableData[key] = cloneDeep(
    groupList.value.filter(item => key === item.key)[0]
  );
};
//批量删除
const deleteGroupData = async (ids: any[]) => {
  await deleteGroup(ids);
  await getGroupListData();
};
//复制当前行
const copyGroupData = async (key: string) => {
  await copyGroup(groupList.value.filter(item => key === item.key)[0]);
  await getGroupListData();
};
</script>

<template>
  <s-table
    v-if="groupList[0]"
    bordered
    :data-source="groupList"
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
              @click="updateGroupData(record.key)"
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
      <template v-if="column.dataIndex === 'expectTimes'">
        <div class="editable-cell">
          <div
            v-if="editableData[record.key]"
            class="editable-cell-input-wrapper"
          >
            <el-input-number
              v-model="editableData[record.key].expectTimes"
              placeholder="Please input"
            />
            <check-outlined
              class="editable-cell-icon-check"
              @click="updateGroupData(record.key)"
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
          <div
            v-if="editableData[record.key]"
            class="editable-cell-input-wrapper"
          >
            <el-input-number
              v-model="editableData[record.key].expectWeight"
              placeholder="Please input"
              :precision="1"
              :step="0.1"
            />
            <check-outlined
              class="editable-cell-icon-check"
              @click="updateGroupData(record.key)"
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
      <template v-else-if="column.dataIndex === 'operation'">
        <el-button type="primary" text @click="deleteGroupData([record.key])"
          >删除
        </el-button>
        <el-button type="primary" text @click="copyGroupData(record.key)"
          >复制
        </el-button>
      </template>
    </template>
  </s-table>
</template>

<style scoped lang="scss">
@import url("@/style/table.scss");
</style>
