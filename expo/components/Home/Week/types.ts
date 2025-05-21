// HAPPY

export type Color = "primary" | "grey" | "transparent";

export type Border = "thick" | "normal" | "dashed" | "none";

export type Day = {
  color: Color;
  border: Border;
  isToday: boolean;
  isFuture: boolean;
};
