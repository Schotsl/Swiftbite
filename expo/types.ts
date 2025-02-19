import { Estimation } from "../types";

export type Image = {
  uri: string;
  width: number;
  height: number;
};

export enum Status {
  Idle = "idle",
  Resizing = "resizing",
  ResizingDone = "resizing-done",
  Analyzing = "analyzing",
  AnalyzingDone = "analyzing-done",
}

export type FoodItem = {
  id: string;
  title?: string;
  nutrition?: Estimation;
};

export type FoodItemLocal = FoodItem & {
  status: Status;
  pending: boolean;

  image: Image;
  imageBase64Small?: string;
  imageBase64Large?: string;
};
