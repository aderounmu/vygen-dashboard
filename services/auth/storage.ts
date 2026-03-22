
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
  console.log("Here-----> 56")
//   await localStorage.deleteItem("token");
  
  localStorage.removeItem("sessionId");
  localStorage.removeItem("userId");
  localStorage.removeItem("email");
  localStorage.removeItem("name");
  localStorage.clear();
};