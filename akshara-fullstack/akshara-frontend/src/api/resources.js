import client from "./client";

export const AuthAPI = {
  register: (payload) => client.post("/auth/register/", payload),
  login: (username, password) =>
    client.post("/auth/login/", { username, password }),
};

export const LearnerAPI = {
  me: () => client.get("/learners/me/"),
  update: (payload) => client.patch("/learners/me/", payload),
};

export const ContentAPI = {
  languages: () => client.get("/languages/"),
  courses: () => client.get("/courses/"),
  lessons: (params = {}) => client.get("/lessons/", { params }),
};

export const AssessmentAPI = {
  list: () => client.get("/assessments/"),

  get: (id) =>
    client.get(`/assessments/${id}/`),

  start: (id) =>
    client.post(`/assessments/${id}/start/`),

  submit: (id, payload) =>
    client.post(`/assessments/${id}/submit/`, payload),

  initialAssessment: (payload) =>
    client.post("/initial-assessment/submit/", payload),
};

export const ProgressAPI = {
  mine: () => client.get("/progress/me/"),

  update: (lesson, percent_complete) =>
    client.post("/progress/update/", {
      lesson,
      percent_complete,
    }),

  myRecommendations: () =>
    client.get("/recommendations/me/"),
};