import { fetchRepeat, insertEntry } from "@/utils/supabase";

export const maxDuration = 120;

const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export async function POST() {
  const currentDate = new Date();
  const currentDay = currentDate.getDay();
  const currentLabel = days[currentDay];

  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();

  const repeats = await fetchRepeat();
  const repeatsPromises = repeats.map((repeat) => {
    if (!repeat.weekdays.includes(currentLabel)) {
      return;
    }

    const repeatDate = new Date(repeat.time);
    const repeatHour = repeatDate.getHours();
    const repeatMinute = repeatDate.getMinutes();

    if (repeatHour !== currentHour || repeatMinute !== currentMinute) {
      return;
    }

    insertEntry({
      serving: repeat.serving,
      user_id: repeat.user_id,
      meal_id: repeat.meal_id,
      product_id: repeat.product_id,
    });
  });

  await Promise.all(repeatsPromises);

  // Get all products for the current day repeats
  return new Response("{}", { status: 200 });
}
