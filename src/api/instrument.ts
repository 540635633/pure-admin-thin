import { http, RequestPrefix, ListResult } from "@/utils/http";

enum Api {
  list = RequestPrefix + "/gym/instrument/list",
  options = RequestPrefix + "/gym/instrument/options"
}

/** 获取动作管理列表 */
export const getInstrumentOptions = (data?: object) => {
  return http.request<ListResult>("get", Api.options, { data });
};
