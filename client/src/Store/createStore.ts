import * as d3 from "d3";
import {
  set_data,
  set_index_construct_params,
  set_index_search_params,
  search_by_id,
} from "Server";

const createStore = () => {
  return {
    indexType: [],
    searchRes: {},
    async setData(file: File) {
      await set_data(file);
    },
    async setIndexConstructParams(index_type: string, params: any) {
      await set_index_construct_params(index_type, params);
    },
    async setIndexSearchParams(params: any) {
      await set_index_search_params(params)
    },
    async searchById(id: string | number) {
      const res = await search_by_id(id)
      this.searchRes = res as any;
    },
  };
};

export default createStore;
