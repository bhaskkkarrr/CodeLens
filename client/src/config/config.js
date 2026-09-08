if (!import.meta.env.VITE_GITHUB_CLIENT_ID) {
  throw new Error("No GITHUB_CLIENT_ID found in environment variables");
}
if (!import.meta.env.VITE_BACKEND_URL) {
  throw new Error("No BACKEND_URL found in environment variables");
}

export const config = {
  GITHUB_CLIENT_ID: import.meta.env.VITE_GITHUB_CLIENT_ID,
  BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
};
