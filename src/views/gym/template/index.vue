<script setup lang="ts">
//选中ids
import { onMounted, reactive, ref, UnwrapRef } from "vue";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import {
  getTemplateList,
  insertTemplate,
  updateTemplate,
  deleteTemplate,
  Template
} from "@/api/template";
import { getActionOptions } from "@/api/action";
import { Pagination } from "@/components/Pagination/Pagination";
import { cloneDeep } from "@pureadmin/utils";
import { Key } from "@surely-vue/table/dist/src/components/interface";
import { dict } from "@/utils/dict";
import TemplateAction from "@/views/gym/template/components/templateAction.vue";

const sTableDiv = ref([]);

const ids = ref([]);
//模板列表
const templateList = ref([]);
//弹框
const dialogVisible = ref(false);
//动作下拉
const actionOptions = ref<any>([]);
//编辑数据
const editableData: UnwrapRef<Record<Template, any>> = reactive({});
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
    title: "模板名",
    dataIndex: "name",
    autoHeight: true
  },
  {
    title: "动作",
    width: "60%",
    dataIndex: "actionIds"
  },
  {
    title: "操作",
    dataIndex: "operation",
    width: "20%"
  }
];

//初始化
onMounted(() => {
  getTemplateListData();
  getActionOptionsData();
  console.log(sTableDiv.value);
});

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
const getTemplateListData = async () => {
  try {
    const { data } = await getTemplateList(pagination.value);
    templateList.value = data.records;
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

//保存时调用
const insertTemplateData = async () => {
  dialogVisible.value = false;
  await insertTemplate(form);
  form.name = null;
  await getTemplateListData();
};
//批量删除
const deleteTemplateData = async (ids: any[]) => {
  await deleteTemplate(ids);
  ids = [];
  await getTemplateListData();
};
//保存时调用
const updateTemplateData = async (key: string) => {
  Object.assign(
    templateList.value.filter(item => key === item.key)[0],
    editableData[key]
  );
  delete editableData[key];
  templateList.value = [].concat(templateList.value);
  console.log(templateList.value);
  await updateTemplate(templateList.value.filter(item => key === item.key)[0]);
  await getTemplateListData();
};
//编辑前时调用
const beforeEdit = (key: string) => {
  editableData[key] = cloneDeep(
    templateList.value.filter(item => key === item.key)[0]
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
      <el-button type="warning" @click="deleteTemplateData(ids)">
        删除
      </el-button>
      <el-button type="success" @click="getTemplateListData"> 刷新 </el-button>
    </div>
    <s-table
      ref="sTableDiv"
      :row-selection="{ selectedRowKeys: ids, onChange: onSelectChange }"
      bordered
      :data-source="templateList"
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
                @click="updateTemplateData(record.key)"
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
        <template v-if="column.dataIndex === 'actionIds'">
          <div class="editable-cell">
            <div
              v-if="editableData[record.key]"
              class="editable-cell-input-wrapper"
            >
              <el-select
                v-model="editableData[record.key].actionIds"
                multiple
                style="width: 100%"
                collapse-tags-tooltip
                placeholder="Select"
                @pressEnter="updateTemplateData(record.key)"
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
                @click="updateTemplateData(record.key)"
              />
            </div>
            <div v-else class="editable-cell-text-wrapper">
              <el-tag class="mx-1" v-for="key in text" :key="key">
                {{ dict(actionOptions, key) }}
              </el-tag>
              <edit-outlined
                class="editable-cell-icon"
                @click="beforeEdit(record.key)"
              />
            </div>
          </div>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <el-button
            type="primary"
            text
            @click="deleteTemplateData([record.key])"
            >删除</el-button
          >
        </template>
      </template>
      <template #expandedRowRender="{ record }">
        <template-action :templateId="record.key" />
      </template>
    </s-table>
    <div class="pagination-block">
      <el-pagination
        layout="prev, pager, next"
        :total="pagination.total"
        v-model:page-size="pagination.size"
        v-model:current-page="pagination.current"
        @current-change="getTemplateListData()"
      />
    </div>
  </el-card>
  <el-dialog v-model="dialogVisible" title="">
    <el-form :model="form">
      <el-form-item label="模板名">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="insertTemplateData()">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped lang="scss">
@import url("@/style/table.scss");
</style>
