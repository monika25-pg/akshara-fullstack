import axios from "axios";

export const API_BASE = "http://127.0.0.1:8000/api";

const client = axios.create({ baseURL: API_BASE });

// Attach the access token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On a 401, try to refresh the access token once, then retry the request
let refreshing = null;

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (!refresh) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        return Promise.reject(error);
      }
      try {
        if (!refreshing) {
          refreshing = axios
            .post(`${API_BASE}/auth/refresh/`, { refresh })
            .then((r) => {
              localStorage.setItem("access", r.data.access);
              refreshing = null;
              return r.data.access;
            })
            .catch((e) => {
              refreshing = null;
              localStorage.removeItem("access");
              localStorage.removeItem("refresh");
              throw e;
            });
        }
        const newAccess = await refreshing;
        original.headers.Authorization = `Bearer ${newAccess}`;
        return client(original);
      } catch (e) {
        return Promise.reject(e);
      }
    }
    return Promise.reject(error);
  }
);

export default client;
