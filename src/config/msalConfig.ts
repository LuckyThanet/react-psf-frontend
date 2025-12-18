import type { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_ADFS_CLIENTID, // Client ID ที่ได้จาก ADFS Application
    authority: "https://auth.kmutt.ac.th/adfs/", // URL ของ ADFS Server
    knownAuthorities: ["auth.kmutt.ac.th"], // โดเมนของ ADFS
    redirectUri: import.meta.env.VITE_ADFS_CALLBACK, // URL ที่จะ Redirect กลับมาหลังจาก Login
  },
  cache: {
    cacheLocation: "localStorage", // เก็บข้อมูล Token ใน LocalStorage
    storeAuthStateInCookie: true, // ใช้ Cookie เพื่อช่วยเก็บสถานะในบางเบราว์เซอร์
  }  
};

export const loginRequest = {
  responseType: "code",
  scopes: ["openid", "profile", "email"],
};