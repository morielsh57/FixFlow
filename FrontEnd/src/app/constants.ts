export const APP_ROUTING_PATHS = {
  AUTH: '/auth',
  LOGIN: 'login',
  SIGNUP: 'signup',
  HOME: '/app',
  ISSUES: 'issues',
};

export const API_ROUTES = {
  AUTH: {
    SIGNUP: '/add-user',
    LOGIN: '/login',
    REFRESH: '/token/refresh',
  },
  USERS: '/users',
  DEPARTMENTS: '/departments',
  ISSUES: {
    GET_ISSUES: '/all-issues',
    UPDATE_ISSUE: '/issue',
    CREATE_ISSUE: '/issues-new',
    GET_PRIORITIES: '/priority',
  },
};

export const AUTH_LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
};
