import fsExtra from "fs-extra";
import readline from "readline";
import { CSV_HISTORY_FILE_PATH, CSV_NEW_FILE_PATH } from "./constants";
import { createLog, createSensorsData } from "./db";

const saveDataToDatabase = async (CSVFilename: string, MD5Filename: string) => {
  try {
    //save in logs table the filename and the datetime
    createLog({
      file_name: CSVFilename,
      date_insertion: new Date(),
    });

    //save in data table the fileContent
    const fileStream = fsExtra.createReadStream(`${CSV_NEW_FILE_PATH}/${CSVFilename}`);

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity,
    });

    let i = 0;
    rl.on("line", (line) => {
      // skip first line
      if (i === 0 || line === "") {
        i++;
      } else {
        const lineArray = line.split(",");

        // convert date string to Date object

        const arr = lineArray[3].split(/-|\s|:/);
        const date = new Date(+arr[0], +arr[1] - 1, +arr[2], +arr[3], +arr[4], +arr[5]);

        createSensorsData({
          temperature: +lineArray[0],
          hydrometry: +lineArray[1],
          wind_power: +lineArray[2],
          datetime: date,
        });
      }
    });

    rl.on("close", () => {
      //move file to csv/history folder
      fsExtra.moveSync(
        `${CSV_NEW_FILE_PATH}/${CSVFilename}`,
        `${CSV_HISTORY_FILE_PATH}/${CSVFilename}`,
      );

      // delete md5 file
      fsExtra.unlink(`${CSV_NEW_FILE_PATH}/${MD5Filename}`);
    });
  } catch (error) {
    console.log(error);
  }
};

export default saveDataToDatabase;
