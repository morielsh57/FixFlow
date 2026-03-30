
export function getItemFromLocalStorage<T>(key: string): T | null {
  try {
    const localStorageValue = localStorage.getItem(key);
    if (localStorageValue) return JSON.parse(localStorageValue);
    return null;
  } catch (error) {
    return null;
  }
}

export function setItemInLocalStorage<T>(key: string, value: T): void {
  try {
    if (isNoneBrowserEnvironment()) return;
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
}

export function removeItemFromLocalStorage(key: string): void {
  try {
    if (isNoneBrowserEnvironment()) return;
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
}

export function isNoneBrowserEnvironment(): boolean {
  return typeof window === 'undefined';
}

export const keysExistInLocalStorage = (keysArr: string[]): boolean => {
  try {
    let isExist = true;
    keysArr.forEach((key) => {
      if (!localStorage.getItem(key)) isExist = false;
    });
    return isExist;
  } catch (error) {
    console.error(error);
    return false;
  }
};
