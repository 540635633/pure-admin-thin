import { http, RequestPrefix, ListResult, DataResult } from "@/utils/http";

enum Api {
  list = RequestPrefix + "/gym/templateAction/list",
  update = RequestPrefix + "/gym/templateAction/update"
}

export interface TemplateAction {
  key: string;
  sortOrder: number;
  name: string;
  instrumentId: string;
  partIds: string[];
}
/** 获取模板下动作管理列表 */
export const getTemplateActionList = (data?: any) => {
  return http.get<any, ListResult>(Api.list + `?templateId=${data}`);
};

/** 保存动作管理列表 */
export const updateTemplateAction = (data?: object) => {
  return http.request<DataResult>("put", Api.update, { data });
};
