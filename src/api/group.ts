import { http, RequestPrefix, ListResult, DataResult } from "@/utils/http";

enum Api {
  list = RequestPrefix + "/gym/group/list",
  update = RequestPrefix + "/gym/group/update",
  remove = RequestPrefix + "/gym/group/remove",
  addGroup = RequestPrefix + "/gym/group/addGroup",
  copy = RequestPrefix + "/gym/group/copy"
}

export interface TemplateAction {
  key: string;
  sortOrder?: number;
  expectTimes?: number;
  expectWeight?: number;
  partIds?: string[];
}

/** 获取模板下动作管理列表 */
export const getGroupList = (data?: any) => {
  return http.get<any, ListResult<any>>(Api.list + `?templateActionId=${data}`);
};

/** 保存 */
export const updateGroup = (data?: object) => {
  return http.request<DataResult>("put", Api.update, { data });
};

/** 删除 */
export const deleteGroup = (data?: object) => {
  return http.request<DataResult>("delete", Api.remove, { data });
};

export const addGroup = (data?: object) => {
  return http.request<DataResult>("post", Api.addGroup, { data });
};

export const copyGroup = (data?: object) => {
  return http.request<DataResult>("post", Api.copy, { data });
};
