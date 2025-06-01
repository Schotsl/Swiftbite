import language from "@/language";

export const weekdays = [
  language.weekdays.sunday,
  language.weekdays.monday,
  language.weekdays.tuesday,
  language.weekdays.wednesday,
  language.weekdays.thursday,
  language.weekdays.friday,
  language.weekdays.saturday,
].map((day) => day.substring(0, 2));
