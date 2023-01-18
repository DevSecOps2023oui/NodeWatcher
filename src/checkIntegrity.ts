import md5 from "md5";

const CheckIntegrity = (fileContent: Buffer, receivedMD5: string) => {
  try {
    const fileMD5 = md5(fileContent);

    return fileMD5 === receivedMD5;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default CheckIntegrity;
