import jwt from 'jsonwebtoken';
import fs from 'fs';
var privateKey = fs.readFileSync('private.key', 'utf8');
var publicKey = fs.readFileSync('public.key', 'utf8');

export const signJWT = (payload: Object, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(payload, privateKey, {
    ...(options && options),
    algorithm: 'RS256',
  });
};

export const verivyJWT = (token: string) => {
  try {
    const decoded = jwt.verify(token, publicKey);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt is expired or not eligible to use',
      decoded: null,
    };
  }
};
