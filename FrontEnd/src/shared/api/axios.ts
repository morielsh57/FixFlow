import type { EnhancedStore } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import type { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';
import type { IAPIError } from './models';
import { addAuthorizationHeaderInterceptor } from './interceptors';

export const InternalError = {
  message: 'Internal error during request.',
  code: 500,
};

/**
 * Injecting the store to be able to use it inside axios interceptors
 * https://redux.js.org/faq/code-structure#how-can-i-use-the-redux-store-in-non-component-files
 */

// eslint-disable-next-line
let store: EnhancedStore | undefined;

let inMemoryToken: string | null;
let inMemoryRefreshToken: string | null;
let inMemoryLoginType: string | null;
let inMemoryOperatingSystem: string | null;

export const injectStoreAxios = (_store: EnhancedStore) => {
  store = _store;
};

/**
 * The api thunk callback type (because we cannot import it from redux toolkit
 */
type ApiThunkCallback<TData, TArgs> = (args?: TArgs) => Promise<AxiosResponse<TData> | TData>;

/**
 * Create an api thunk, which will run the provided promise and await it
 * @param typePrefix The type prefix of the action
 * @param requestCallback A callback function which returns an api request using axios
 */
export const createApiThunk = <TData, TArgs = void>(
  typePrefix: string,
  requestCallback: ApiThunkCallback<TData, TArgs>,
) => {
  return createAsyncThunk<TData, TArgs, { rejectValue: IAPIError }>(
    typePrefix,
    async (args, { rejectWithValue }) => {
      try {
        const response = await requestCallback(args);
        return (response as AxiosResponse<TData>)?.data ?? (response as TData);
        // eslint-disable-next-line
      } catch (e: unknown) {
        const axiosError = e as AxiosError;
        return rejectWithValue({
          message: axiosError?.message,
          code: axiosError?.response?.status ?? axiosError?.status,
          axiosError,
        });
      }
    },
  );
};

/**
 * An axios instance using our base url, and later our token
 */
// Create the main apiService with the default base URL
export const apiService = createAxiosInstance(`${process.env.REACT_APP_BASE_URL_SERVER}`);

/**
 * Create an Axios instance with the specified base URL
 * @param baseURL The base URL
 */
function msToIso(ms?: number): string | undefined {
  return typeof ms === 'number' ? new Date(ms).toISOString() : undefined;
}

function createAxiosInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
  });

  // Add authorization header interceptor
  instance.interceptors.request.use(addAuthorizationHeaderInterceptor);

  return instance;
}
