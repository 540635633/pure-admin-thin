import { http, RequestPrefix, ListResult, DataResult } from "@/utils/http";
import templates from "rollup-plugin-visualizer/dist/plugin/template-types";

enum Api {
  list = RequestPrefix + "/gym/templateAction/list",
  update = RequestPrefix + "/gym/templateAction/update",
  delete = RequestPrefix + "/gym/templateAction/delete",
  save = RequestPrefix + "/gym/templateAction/save"
}

export interface TemplateAction {
  key: string;
  sortOrder: number;
  actionId: string;
  instrumentId: string;
  partIds: string[];
}
/** 获取模板下动作管理列表 */
export const getTemplateActionList = (data?: any) => {
  const { templateId, version } = data;
  return http.get<any, ListResult<TemplateAction>>(
    Api.list + `?templateId=${templateId}&version=${version}`
  );
};

/** 保存动作管理列表 */
export const updateTemplateAction = (data?: object) => {
  return http.request<DataResult>("put", Api.update, { data });
};

export const deleteTemplateAction = (data?: object) => {
  return http.request<DataResult>("delete", Api.delete, { data });
};

export const saveTemplateAction = (data?: object) => {
  return http.request<DataResult>("post", Api.save, { data });
};
