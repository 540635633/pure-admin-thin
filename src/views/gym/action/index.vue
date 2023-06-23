<script setup lang="ts">
import {
  getActionList,
  updateAction,
  insertAction,
  deleteAction
} from "@/api/action";
import { onMounted, reactive, ref, UnwrapRef } from "vue";
import { cloneDeep } from "@pureadmin/utils";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import { getInstrumentOptions } from "@/api/instrument";
import { getPartOptions } from "@/api/part";
import { dict } from "@/utils/dict";
import { Pagination } from "@/components/Pagination/Pagination";
import { Key } from "@surely-vue/table/dist/src/components/interface";
import { removeWatermark } from "@/utils/removeWatermark";

//选中ids
const ids = ref([]);
//动作列表
const actionList = ref([]);
//部位下拉
const partOptions = ref<any>([]);
//弹框
const dialogVisible = ref(false);
//器械下拉
const instrumentOptions = ref<any>([]);
//编辑数据
const editableData: UnwrapRef<Record<string, any>> = reactive({});
//表单数据
const form = reactive({
  name: ""
});
//分页初始值
const pagination = ref<Pagination>({
  current: 1,
  size: 6,
  total: 0
});
//表单列
const columns = [
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
  },
  {
    title: "操作",
    dataIndex: "operation"
  }
];
//初始化
onMounted(() => {
  removeWatermark();
  getInstrumentOptionsData();
  getActionListData();
  getPartOptionsData();
});
//获取动作列表
const getActionListData = async () => {
  try {
    const { data } = await getActionList(pagination.value);
    actionList.value = data.records;
    pagination.value = {
      ...pagination.value,
      total: data.total
    };
  } catch (e) {
    console.log(e);
  } finally {
    setTimeout(() => {
      //dataLoading.value = false;
    }, 500);
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
const insertActionData = async () => {
  dialogVisible.value = false;
  await insertAction(form);
  form.name = null;
  await getActionListData();
};
//批量删除
const deleteActionData = async (ids: any[]) => {
  await deleteAction(ids);
  ids = [];
  await getActionListData();
};
//保存时调用
const updateActionData = async (key: string) => {
  Object.assign(
    actionList.value.filter(item => key === item.key)[0],
    editableData[key]
  );
  delete editableData[key];
  actionList.value = [].concat(actionList.value);
  await updateAction(actionList.value.filter(item => key === item.key)[0]);
  await getActionListData();
};
//单元格编辑前调用
const beforeEdit = (key: string) => {
  editableData[key] = cloneDeep(
    actionList.value.filter(item => key === item.key)[0]
  );
};

const onSelectChange = (selectedRowKeys: Key[]) => {
  ids.value = selectedRowKeys;
};
</script>

<template>
  <el-card class="box-card">
    <div style="margin-bottom: 20px">
      <el-button type="primary" @click="dialogVisible = true"> 新增 </el-button>
      <el-button type="warning" @click="deleteActionData(ids)">
        删除
      </el-button>
      <el-button type="success" @click="getActionListData"> 刷新 </el-button>
    </div>
    <s-table
      :row-selection="{ selectedRowKeys: ids, onChange: onSelectChange }"
      bordered
      :data-source="actionList"
      :columns="columns"
      :pagination="false"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <el-input
                v-model="editableData[record.key].name"
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
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <el-select
                v-model="editableData[record.key].instrumentId"
                style="width: 100%"
                collapse-tags-tooltip
                placeholder="Select"
                @pressEnter="updateActionData(record.key)"
              >
                <el-option
                  v-for="item in instrumentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <check-outlined
                class="editable-cell-icon-check"
                @click="updateActionData(record.key)"
              />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              <el-tag class="mx-1" v-if="text">
                {{ dict(instrumentOptions, text) }}
              </el-tag>
              <edit-outlined
                class="editable-cell-icon"
                @click="beforeEdit(record.key)"
              />
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'partIds'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <el-select
                v-model="editableData[record.key].partIds"
                multiple
                style="width: 100%"
                collapse-tags-tooltip
                placeholder="Select"
                @pressEnter="updateActionData(record.key)"
              >
                <el-option
                  v-for="item in partOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <check-outlined
                class="editable-cell-icon-check"
                @click="updateActionData(record.key)"
              />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              <el-tag class="mx-1" v-for="key in text" :key="key">
                {{ dict(partOptions, key) }}
              </el-tag>
              <edit-outlined
                class="editable-cell-icon"
                @click="beforeEdit(record.key)"
              />
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <el-button type="primary" text @click="deleteActionData([record.key])"
            >删除</el-button
          >
        </template>
      </template>
    </s-table>
    <div class="pagination-block">
      <el-pagination
        layout="prev, pager, next"
        :total="pagination.total"
        v-model:page-size="pagination.size"
        v-model:current-page="pagination.current"
        @current-change="getActionListData()"
      />
    </div>
  </el-card>
  <el-dialog v-model="dialogVisible" title="">
    <el-form :model="form">
      <el-form-item label="动作名">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="insertActionData()"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="less">
@import url("@/style/table.scss");
</style>
