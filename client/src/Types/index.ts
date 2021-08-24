export type TNodeType = "target" | "fine" | "coarse" | "upper_level";

export interface INode {
  auto_id: string;
  id: string;
  projection: [number, number];
  type: TNodeType;
  cluster_id?: number;
}

export interface ILevel {
  fine_centroid_projection: [number, number];
  level: number;
  have_cluster: number;
  nodes: INode[];
}

export interface IRes {
  data: ILevel[];
  num_level: number;
}


export interface IStore {
  indexTypeList: string[];
  indexTypeIndex: number;
  setIndexTypeIndex: (typeIndex: number) => void;

  targetId: number;
  setTargetId: (id: number) => void;

  setData: (file: File) => void;
  setIndexConstructParams: (index_type: string, params: any) => void;
  setIndexSearchParams: (params: any) => void;

  levelsData: ILevel[];
  numLevel: number;
  searchById: () => void;
  currentLevel: number;
  setCurrentLevel: (level: number) => void;
}