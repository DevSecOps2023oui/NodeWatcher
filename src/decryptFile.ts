import fsExtra from "fs-extra";
import { privateDecrypt, constants, createPrivateKey } from "crypto";

const privateKey = fsExtra.readFileSync("private_key.key");

const decryptData = (data: Buffer) => {
  return privateDecrypt(
    {
      key: createPrivateKey(privateKey),
      passphrase: "",
      padding: constants.RSA_PKCS1_OAEP_PADDING,
    },
    data,
  );
};

export default decryptData;
