import type { InternalAxiosRequestConfig } from 'axios';
import { getItemFromLocalStorage } from '../utils/localStorage.utils';
import { EnhancedStore } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';

/**
 * Injecting the store to be able to use it inside axios interceptors
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

// eslint-disable-next-line
let store: EnhancedStore<RootState> | undefined;
export const injectStoreAxiosInterceptors = (_store: EnhancedStore) => {
  store = _store;
};

/**
 * Add auth header with token, depending on server convention you might not need to add the word 'Bearer'
 * @param config axios config
 */
export const addAuthorizationHeaderInterceptor = (config: InternalAxiosRequestConfig) => {
  try {
    let token = getItemFromLocalStorage<string>("tokenLocalStorageKey");
    if (config?.headers) {
      // if there is a token saved try to use it and set it in the headers in the request.
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
};