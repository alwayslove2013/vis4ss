import qs from "qs";
import { IRes } from "Types";

// const baseUrl = "";
const baseUrl = "http://127.0.0.1:12357/";

const fetchData = (url: string, params = {}) => {
  const getUrl =
    baseUrl + url + (url.includes("?") ? "&" : "?") + qs.stringify(params);
  return new Promise((resolve, reject) => {
    fetch(getUrl)
      .then((res) => res.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

export const set_data = (file: File) => {
  const form = new FormData();
  form.append("file", file);
  const url = baseUrl + "set_data";
  return fetch(url, {
    body: form,
    method: "POST",
  }).then((res) => res.json());
};

export const set_index_construct_params = (index_type: string, params: any) => {
  const url = "index_construct_params";
  return fetchData(url, {
    index_type,
    params,
  });
};

export const set_index_search_params = (params: any) => {
  const url = "index_search_params";
  return fetchData(url, {
    params,
  });
};

export const search_by_id = (id: number | string) => {
  const url = "search_by_id";
  return fetchData(url, {
    id,
  }) as Promise<IRes>;
};
