// import * as d3 from "d3";
import {
  set_data,
  set_index_construct_params,
  set_index_search_params,
  search_by_id,
} from "Server";
import { runInAction } from "mobx";
import { IStore } from "Types";

const indexTypes = ["IVF_Flat", "HNSW"];

const createStore = () => {
  return {
    indexTypeList: indexTypes,
    indexTypeIndex: 0,
    setIndexTypeIndex(typeIndex: number) {
      this.indexTypeIndex = typeIndex;
    },

    targetId: 0,
    setTargetId(id: number) {
      this.targetId = id;
      this.searchById();
    },
    async setData(file: File) {
      await set_data(file);
    },
    async setIndexConstructParams(index_type: string, params: any) {
      await set_index_construct_params(index_type, params);
    },
    async setIndexSearchParams(params: any) {
      await set_index_search_params(params);
    },
    levelsData: [],
    async searchById() {
      const id = this.targetId;
      console.log("searchById begin", id);
      const res = await search_by_id(id);
      console.log("get search res", res);
      if ("data" in res) {
        runInAction(() => {
          this.levelsData = res.data;
          this.numLevel = res.num_level;
        });
      }
    },

    currentLevel: 0,
    numLevel: 2,
    setCurrentLevel(level: number) {
      this.currentLevel = level;
    },
  } as IStore;
};

export default createStore;
