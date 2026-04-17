import { notification } from 'antd';

export const showErrorAlert = (errorMessage?: string): void => {
  notification.error({
    message: (errorMessage ?? '').trim() || 'Something went wrong. Please try again.',
    placement: 'top',
    duration: 4,
  });
};
