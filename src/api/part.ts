import { http, RequestPrefix, ListResult } from "@/utils/http";

enum Api {
  list = RequestPrefix + "/gym/part/list",
  options = RequestPrefix + "/gym/part/options"
}

/** 获部位管理列表 */
export const getPartOptions = (data?: object) => {
  return http.request<ListResult<any>>("get", Api.options, { data });
};
