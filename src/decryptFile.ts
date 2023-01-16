import fsExtra from "fs-extra";
import { privateDecrypt, constants } from "crypto";

const publicKey = fsExtra.readFileSync("public.pem", "utf8");

const decryptData = (data: Buffer) =>
  privateDecrypt(
    {
      key: publicKey,
      padding: constants.RSA_NO_PADDING,
      oaepHash: "sha256",
    },
    data,
  );

export default decryptData;
