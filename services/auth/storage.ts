
import { AuthResponse } from "./type";

export const saveSession = async (response: AuthResponse) => {
  const firstItem = response.data?.[0];

  if (!firstItem) return;

  await localStorage.setItem("sessionId", firstItem.session_id);
  await localStorage.setItem("userId", firstItem.user.id);
  await localStorage.setItem("email", firstItem.user.email);
  await localStorage.setItem(
    "name",
    `${firstItem.user.first_name} ${firstItem.user.last_name}`.trim()
  );
};

export const clearAuthStorage = async () => {
//   await localStorage.deleteItem("token");
  await localStorage.deleteItem("sessionId");
  await localStorage.deleteItem("userId");
  await localStorage.deleteItem("email");
  await localStorage.deleteItem("name");
  await localStorage.clear();
};