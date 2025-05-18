import { Tables } from "./database.types";
import { ServingData } from "./schemas/serving";
import { Product } from "./types/product";

export type MacroAbsolute = {
  fat: number;
  carbs: number;
  protein: number;
  calories: number;
};

export type Option = {
  value: string;
  title: string;
};

export type OptionWithGram = Option & {
  gram: number;
};

export type Image = {
  uri: string;
  width: number;
  height: number;
};

export enum CameraSelected {
  Label = "Label",
  Barcode = "Barcode",
  Estimation = "Estimation",
}

export type Generative = Tables<"generative">;

export type GenerativeInsert = Omit<
  Generative,
  "uuid" | "user_id" | "created_at" | "updated_at"
>;

export enum HealthStatus {
  Ready = "ready",
  Error = "error",
  Loading = "loading",
  Refreshing = "refreshing",
}
