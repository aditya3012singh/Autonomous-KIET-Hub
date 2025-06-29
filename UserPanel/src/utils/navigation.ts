// utils/navigation.ts
let navigateFn: ((path: string) => void) | null = null;

export const setGlobalNavigate = (navigate: (path: string) => void) => {
  navigateFn = navigate;
};

export const redirectToLogin = () => {
  if (navigateFn) {
    navigateFn('/login');
  } else {
    window.location.href = '/login'; // fallback
  }
};

export const logoutAndRedirect = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  redirectToLogin();
};
