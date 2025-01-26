import { jwtDecode, JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
  exp: number;
}

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    if (!exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return exp < currentTime;
  } catch {
    return true;
  }
};
