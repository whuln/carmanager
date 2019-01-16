import Cookies from "js-cookie";

export const TOKEN_KEY = "logintoken";
export const USER_INFO = "me";
export const CHECKERS_INFO = "checkers";

const in30Minutes = 1 / 48,
  in60Minutes = 1 / 24,
  in2Minutes = 1 / 720;

export const setToken = token => {
  Cookies.set(TOKEN_KEY, token, { expires: in60Minutes });
};

export const getToken = () => {
  const token = Cookies.get(TOKEN_KEY);
  if (token) return token;
  else return false;
};
