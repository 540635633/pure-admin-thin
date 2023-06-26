import { http, RequestPrefix, PageResult, DataResult } from "@/utils/http";
import { Pagination } from "@/components/Pagination/Pagination";

enum Api {
  list = RequestPrefix + "/gym/templateLog/list",
  update = RequestPrefix + "/gym/templateLog/update",
  delete = RequestPrefix + "/gym/templateLog/delete",
  export = RequestPrefix + "/gym/templateLog/export"
}

export interface TemplateLog {
  key: string;
  name: string;
  templateId: string;
  actionIds: string[];
  startTime: Date;
  endTime: Date;
}

export const getTemplateLogList = (data?: Pagination) => {
  return http.get<Pagination, PageResult<TemplateLog>>(
    Api.list + `?size=${data.size}&current=${data.current}`
  );
};

export const exportTemplateLog = data => {
  return http.get<any, DataResult>(Api.export + `?templateLogId=${data}`);
};

export const updateTemplateLog = (data?: TemplateLog) => {
  return http.request<DataResult>("put", Api.update, { data });
};

export const deleteTemplateLog = (data?: object) => {
  return http.request<DataResult>("delete", Api.delete, { data });
};
