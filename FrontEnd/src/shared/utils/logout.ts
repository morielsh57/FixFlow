export const logOut = () => {
  localStorage.clear();
  window.location.reload();
}