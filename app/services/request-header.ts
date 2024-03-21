import { encode } from 'js-base64';

export const base64Credentials = encode(
  `${process.env.EXPO_PUBLIC_MPA_AUTH_USERNAME}:${process.env.EXPO_PUBLIC_MPA_AUTH_PASSWORD}`
);

export const requestHeader = {
  'Content-Type': 'application/json',
  'Authorization': `Basic ${base64Credentials}`
};
