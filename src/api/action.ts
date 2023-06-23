import {
  http,
  RequestPrefix,
  PageResult,
  ListResult,
  DataResult
} from "@/utils/http";
import { Pagination } from "@/components/Pagination/Pagination";

enum Api {
  list = RequestPrefix + "/gym/action/list",
  save = RequestPrefix + "/gym/action/save",
  update = RequestPrefix + "/gym/action/update",
  remove = RequestPrefix + "/gym/action/remove",
  options = RequestPrefix + "/gym/action/options"
}

export interface Action {
  key: string;
  name: string;
  instrumentId: string;
  partIds: string[];
}

/** 获取动作管理列表 */
export const getActionList = (data?: Pagination) => {
  return http.get<Pagination, PageResult>(
    Api.list + `?size=${data.size}&current=${data.current}`
  );
};

/** 保存动作管理列表 */
export const updateAction = (data?: object) => {
  return http.request<DataResult>("put", Api.update, { data });
};

/** 新增动作 */
export const insertAction = (data?: object) => {
  return http.request<DataResult>("post", Api.save, { data });
};

/** 删除动作 */
export const deleteAction = (data?: object) => {
  return http.request<DataResult>("delete", Api.remove, { data });
};

/** 获取动作下拉 */
export const getActionOptions = (data?: Pagination) => {
  return http.request<ListResult>("get", Api.options, { data });
};
