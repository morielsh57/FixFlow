export const APP_ROUTING_PATHS = {
  AUTH: '/auth',
  LOGIN: 'login',
  HOME: '/app',
  ISSUES: 'issues',
};

export const API_ROUTES = {
  AUTH: {
    SIGNUP: '/add-user/',
    LOGIN: '/login/',
    REFRESH: '/token/refresh/',
  },
  USERS: '/users/',
  ISSUES: {
    UPDATE_ISSUE: 'issues-new/',
    CREATE_ISSUE: 'issues-new/',
  },
};

export const AUTH_LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};
