const qr = require("qr-image");

require("dotenv").config();
const crypto = require("crypto");

const algorithm = "aes-256-cbc";
const key = crypto.scryptSync(
  process.env.SECRET_KEY || "XStudy1130",
  "salt",
  32
);
const iv = crypto.randomBytes(16);

export interface ISuccessResponse {
  success: true;
  message: string | Array<object> | object;
  status: number;
  data?: any;
}
export const response = {
  success: (res: any, status: number, message: string, data?: any) => {
    const response: ISuccessResponse = {
      success: true,
      message,
      status: status,
    };
    if (data) response.data = data;
    res.status(status).json(response);
  },

  fail: (res: any, status: number, message: string | object) => {
    res.status(status).json({
      success: false,
      message,
      status: status,
    });
  },
  internal: (res: any, status: number, message: string, error: any) => {
    res.status(status).json({
      success: false,
      message,
      status: status,
      error,
    });
  },
};

export const helper = {
  encrypt: async (text: string) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + encrypted;
  },
  decrypt: async (encrypted: any): Promise<number | string> => {
    const iv = encrypted.slice(0, 32);
    const encryptedData = encrypted.slice(32);
    const decipher = crypto.createDecipheriv(
      algorithm,
      key,
      Buffer.from(iv, "hex")
    );
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  },
  generateOTP: async (): Promise<string> => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },
  generateQRCode: async (data: any) => {
    const qrCode = qr.imageSync(data, { type: "svg" });
    return qrCode.toString("base64");
  },
};

export class HttpError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
}
