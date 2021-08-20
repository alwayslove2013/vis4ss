import * as d3 from "d3";
import { set_data } from "Server";

const createStore = () => {
  return {
    indexType: [],
    res: [],
    async setData(file: any) {
      const res = await set_data(file);
      console.log(res)
      this.res = res;
    },
  };
};

export default createStore;
