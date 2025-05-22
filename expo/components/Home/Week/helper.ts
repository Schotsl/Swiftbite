// HAPPY

import language from "@/language";

import { Border, Color, Day } from "./types";

export const getLetter = (date: Date): string => {
  const weekdays = [
    language.weekdays.monday,
    language.weekdays.tuesday,
    language.weekdays.wednesday,
    language.weekdays.thursday,
    language.weekdays.friday,
    language.weekdays.saturday,
    language.weekdays.sunday,
  ].map((day) => day.slice(0, 1));

  const index = date.getDay();
  const letter = weekdays[index];

  return letter;
};

export function getDay(
  dateItem: Date,
  dateToday: Date,
  dateView: Date,
  datesUsed: string[],
): Day {
  const dateString = dateItem.toISOString().split("T")[0];

  const isToday = dateItem.toDateString() === dateToday.toDateString();
  const isLooking = dateItem.toDateString() === dateView.toDateString();
  const isFuture = dateItem > dateToday;
  const isIncluded = datesUsed.includes(dateString);

  let color: Color = "transparent";
  let border: Border = "normal";

  if (isLooking) {
    border = "thick";
  } else if (isFuture) {
    border = "none";
  } else if (!isIncluded) {
    border = "dashed";
  }

  if (isToday) {
    color = "primary";
  } else if (isFuture) {
    color = "grey";
  }

  return { color, border, isFuture, isToday };
}
