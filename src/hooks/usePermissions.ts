export function usePermissions() {
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return [];
  }

  const user = JSON.parse(storedUser);

  return user.permissions || [];
}
