import { http, RequestPrefix, ListResult, DataResult } from "@/utils/http";

enum Api {
  list = RequestPrefix + "/gym/groupLog/list",
  update = RequestPrefix + "/gym/groupLog/update",
  recordLog = RequestPrefix + "/gym/groupLog/recordLog"
}

export interface TemplateAction {
  key: string;
  sortOrder?: number;
  expectTimes?: number;
  actualTimes?: number;
  expectWeight?: number;
  rm?: number;
  rpe?: number;
}

/** 获取模板下动作管理列表 */
export const getGroupLogList = (data?: any) => {
  const { templateActionId, templateLogId } = data;
  return http.get<any, ListResult<TemplateAction>>(
    Api.list +
      `?templateActionId=${templateActionId}&templateLogId=${templateLogId}`
  );
};

/** 保存 */
export const updateGroupLog = (data?: object) => {
  return http.request<DataResult>("put", Api.update, { data });
};

/** 记录日记 */
export const recordLog = (data?: any) => {
  return http.get<any, ListResult<any>>(Api.recordLog + `?templateId=${data}`);
};
