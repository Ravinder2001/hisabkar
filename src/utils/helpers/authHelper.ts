import { jwtDecode, JwtPayload } from "jwt-decode";

interface DecodedToken extends JwtPayload {
  exp: number;
}

export const decodeJWT = (token: string) => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch {
    return true;
  }
};
