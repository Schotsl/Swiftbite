import { usePathname } from "expo-router";

export default function useCamera() {
  const pathname = usePathname();
  const camera = [
    "/add/camera",
    "/automations/meal/upsert/camera",
    "/automations/repeat/upsert/camera",
  ].includes(pathname);

  return camera;
}
