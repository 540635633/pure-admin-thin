import {
  http,
  RequestPrefix,
  PageResult,
  ListResult,
  DataResult
} from "@/utils/http";
import { Pagination } from "@/components/Pagination/Pagination";

enum Api {
  list = RequestPrefix + "/gym/template/list",
  save = RequestPrefix + "/gym/template/save",
  update = RequestPrefix + "/gym/template/update",
  remove = RequestPrefix + "/gym/template/remove"
}

export interface Template {
  key: string;
  name: string;
  actionIds: string[];
}

/** 获取动作管理列表 */
export const getTemplateList = (data?: Pagination) => {
  return http.get<Pagination, PageResult>(
    Api.list + `?size=${data.size}&current=${data.current}`
  );
};

/** 保存动作管理列表 */
export const updateTemplate = (data?: object) => {
  return http.request<ListResult>("put", Api.update, { data });
};

/** 新增动作 */
export const insertTemplate = (data?: object) => {
  return http.request<DataResult>("post", Api.save, { data });
};

/** 删除动作 */
export const deleteTemplate = (data?: object) => {
  return http.request<DataResult>("delete", Api.remove, { data });
};
