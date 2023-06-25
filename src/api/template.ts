import { http, RequestPrefix, PageResult, DataResult } from "@/utils/http";
import { Pagination } from "@/components/Pagination/Pagination";

enum Api {
  list = RequestPrefix + "/gym/template/list",
  save = RequestPrefix + "/gym/template/save",
  update = RequestPrefix + "/gym/template/update",
  delete = RequestPrefix + "/gym/template/delete",
  copy = RequestPrefix + "/gym/template/copy",
  up = RequestPrefix + "/gym/template/up"
}

export interface Template {
  key: string;
  name: string;
  version: number;
  actionIds: string[];
}

/** 获取动作管理列表 */
export const getTemplateList = (data?: Pagination) => {
  return http.get<Pagination, PageResult<Template>>(
    Api.list + `?size=${data.size}&current=${data.current}`
  );
};

export const templateCopy = (data?: Pagination) => {
  return http.get<Pagination, PageResult<Template>>(
    Api.copy + `?templateId=${data}`
  );
};

export const templateUp = (data?: Pagination) => {
  return http.get<Pagination, PageResult<Template>>(
    Api.up + `?templateId=${data}`
  );
};

/** 保存动作管理列表 */
export const updateTemplate = (data?: object) => {
  return http.request<DataResult>("put", Api.update, { data });
};

/** 新增动作 */
export const insertTemplate = (data?: object) => {
  return http.request<DataResult>("post", Api.save, { data });
};

/** 删除动作 */
export const deleteTemplate = (data?: object) => {
  return http.request<DataResult>("delete", Api.delete, { data });
};
