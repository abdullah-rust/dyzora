import { api } from "./api";

export async function check_login(): Promise<boolean | any> {
  try {
    const res = await api.get("/auth/me");
    if (res.status == 200) {
      return true;
    } else {
      return false;
    }
  } catch (e) {}
}
