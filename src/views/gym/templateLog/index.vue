<script setup lang="ts">
//选中ids
import { onMounted, reactive, ref, UnwrapRef } from "vue";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import {
  getTemplateLogList,
  updateTemplateLog,
  deleteTemplateLog,
  TemplateLog,
  exportTemplateLog
} from "@/api/templateLog";
import { getActionOptions } from "@/api/action";
import { Pagination } from "@/components/Pagination/Pagination";
import { cloneDeep } from "@pureadmin/utils";
import { dict } from "@/utils/dict";
import TemplateAction from "@/views/gym/templateLog/components/templateAction.vue";
import { removeWatermark } from "@/utils/removeWatermark";

//模板列表
const templateLogList = ref<TemplateLog[]>([]);
//动作下拉
const actionOptions = ref<any>([]);
//编辑数据
const editableData: UnwrapRef<Record<string, any>> = reactive({});

//分页初始值
const pagination = ref<Pagination>({
  current: 1,
  size: 6,
  total: 0
});
//表单列
const columns = [
  {
    title: "日记名",
    dataIndex: "name",
    width: "10%",
    autoHeight: true
  },
  {
    title: "动作",
    width: "25%",
    dataIndex: "actionIds"
  },
  {
    title: "版本",
    width: "7%",
    dataIndex: "version"
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
    width: "20%"
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    width: "20%"
  },
  {
    title: "操作",
    dataIndex: "operation"
  }
];

const shortcuts = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      return [start, end];
    }
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
      return [start, end];
    }
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
      return [start, end];
    }
  }
];

//初始化
onMounted(() => {
  removeWatermark();
  getTemplateLogListData();
  getActionOptionsData();
});

const refresh = () => {
  getTemplateLogListData();
  getActionOptionsData();
};

//获取部位下拉
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

//获取模板列表
const getTemplateLogListData = async () => {
  try {
    const { data } = await getTemplateLogList(pagination.value);
    templateLogList.value = data.records;
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
//批量删除
const deleteTemplateLogData = async (ids: any[]) => {
  await deleteTemplateLog(ids);
  ids = [];
  await getTemplateLogListData();
};
const exportTemplateLogData = async data => {
  await exportTemplateLog(data);
  await getTemplateLogListData();
};
//保存时调用
const updateTemplateLogData = async (key: string) => {
  Object.assign(
    templateLogList.value.filter(item => key === item.key)[0],
    editableData[key]
  );
  delete editableData[key];
  templateLogList.value = [].concat(templateLogList.value);
  await updateTemplateLog(
    templateLogList.value.filter(item => key === item.key)[0]
  );
  await getTemplateLogListData();
};
//单元格编辑前调用
const beforeEdit = (key: string) => {
  editableData[key] = cloneDeep(
    templateLogList.value.filter(item => key === item.key)[0]
  );
};
</script>

<template>
  <el-card class="box-card">
    <div style="margin-bottom: 20px">
      <el-button type="success" @click="refresh"> 刷新 </el-button>
    </div>
    <s-table
      bordered
      :data-source="templateLogList"
      :columns="columns"
      :pagination="false"
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'name'">
          <div class="editable-cell">
            <div class="editable-cell-text-wrapper">
              {{ text || " " }}
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'actionIds'">
          <div class="editable-cell">
            <div class="editable-cell-text-wrapper">
              <el-tag class="mx-1" v-for="key in text" :key="key">
                {{ dict(actionOptions, key) }}
              </el-tag>
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'version'">
          <div class="editable-cell">
            <div class="editable-cell-text-wrapper">
              <el-tag class="mx-1" v-if="text">
                {{ text }}
              </el-tag>
            </div>
          </div>
        </template>
        <template v-if="column.dataIndex === 'startTime'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <el-date-picker
                v-model="editableData[record.key].startTime"
                :shortcuts="shortcuts"
                style="width: 180px"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
              <check-outlined
                class="editable-cell-icon-check"
                @click="updateTemplateLogData(record.key)"
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
        <template v-if="column.dataIndex === 'endTime'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <el-date-picker
                v-model="editableData[record.key].endTime"
                :shortcuts="shortcuts"
                style="width: 180px"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
              />
              <check-outlined
                class="editable-cell-icon-check"
                @click="updateTemplateLogData(record.key)"
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
          <!--          <el-button
            type="primary"
            text
            @click="deleteTemplateLogData([record.key])"
            >删除</el-button
          >-->
          <el-button
            type="primary"
            text
            @click="exportTemplateLogData(record.key)"
            >导出</el-button
          >
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <template-action
          :version="record.version"
          :templateId="record.templateId"
          :templateLogId="record.key"
        />
      </template>
    </s-table>
    <div class="pagination-block">
      <el-pagination
        layout="prev, pager, next"
        :total="pagination.total"
        v-model:page-size="pagination.size"
        v-model:current-page="pagination.current"
        @current-change="getTemplateLogListData()"
      />
    </div>
  </el-card>
</template>

<style scoped lang="scss">
@import url("@/style/table.scss");
</style>
