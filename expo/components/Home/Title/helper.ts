// HAPPY

import language from "@/language";

export const getDateRelative = (date: Date): string => {
  const today = new Date();

  // Normalize dates to the start of the day for accurate comparison
  const normalizedDateObject = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const normalizedToday = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const diffTime = normalizedDateObject.getTime() - normalizedToday.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return language.days.today;
  } else if (diffDays === 1) {
    return language.days.tomorrow;
  } else if (diffDays === 2) {
    return language.days.tomorrowAfter;
  } else if (diffDays > 2) {
    return language.days.getFuture(diffDays);
  } else if (diffDays === -1) {
    return language.days.yesterday;
  } else if (diffDays === -2) {
    return language.days.yesterdayBefore;
  } else {
    return language.days.getPast(Math.abs(diffDays));
  }
};
