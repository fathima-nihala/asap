export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
    document.cookie = `token=${token}; path=/`;
  }
};

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
  }
};
