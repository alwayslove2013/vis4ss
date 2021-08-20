export type TNode = "target" | "fine" | "coarse" | "centroid";


export interface IResNode {
    id: string;
    projection: [number, number];
    type: TNode;
    list_id: number;
  };