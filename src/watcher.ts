import decompress from "decompress";
import chokidar from "chokidar";
const EventEmitter = require("events").EventEmitter;
import fsExtra from "fs-extra";
import CheckIntegrity from "./checkIntegrity";
import { CSV_FAILED_FILE_PATH, CSV_NEW_FILE_PATH, CSV_PROCESSING_FILE_PATH } from "./constants";
import saveDataToDatabase from "./saveToDatabase";

class Observer extends EventEmitter {
  constructor() {
    super();
  }

  watchFolder(folder: string | readonly string[]) {
    try {
      console.log(`[${new Date().toLocaleString()}] Watching for folder changes on: ${folder}`);

      var watcher = chokidar.watch(folder, { persistent: true });

      watcher.on("add", async (filePath) => {
        const filename = filePath.replace(CSV_NEW_FILE_PATH.replace("./", "") + "/", "");

        if (filename.indexOf(".zip") !== -1) {
          console.log(`\x1b[33m[${new Date().toLocaleString()}] A new zip file has been added \x1b[0m`);

          //  in treatment folder
          const files = await decompress(filePath, CSV_PROCESSING_FILE_PATH);

          const csvFile = files.find((file) => file.path.indexOf(".csv") !== -1);
          const md5File = files.find((file) => file.path.indexOf(".txt") !== -1);

          // If the zip file contains a csv and a txt file
          if (csvFile && md5File) {
            const isIntegrityGood = CheckIntegrity(csvFile.data, md5File.data.toString());

            // If the integrity is good
            if (isIntegrityGood) {
              // Save data to database
              console.log(
                `\x1b[32mFile integrity is good, saving data to database\x1b[0m`,
              );
              await saveDataToDatabase(filePath, csvFile.path, md5File.path);
            } else {
              handleFailedFile(filePath, csvFile.path, md5File.path);
            }
          } else {
            handleFailedFile(filePath, csvFile?.path, md5File?.path);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const handleFailedFile = async (zipPath: string, csvFilename?: string, md5Filename?: string) => {
  // Move file to failed folder
  console.log(CSV_NEW_FILE_PATH.replace("./", ""));
  
  const zipFilename = zipPath.replace(CSV_NEW_FILE_PATH.replace("./", ""), "");

  console.log(
    `\x1b[31mFile failed, move file to failed folder\x1b[0m`,
  );

  // delete processing files
  if (csvFilename)
    fsExtra.exists(`${CSV_PROCESSING_FILE_PATH}/${csvFilename}`).then((exists) => {
      if (exists) fsExtra.remove(`${CSV_PROCESSING_FILE_PATH}/${csvFilename}`);
    });

  if (md5Filename)
    fsExtra.exists(`${CSV_PROCESSING_FILE_PATH}/${md5Filename}`).then((exists) => {
      if (exists) fsExtra.remove(`${CSV_PROCESSING_FILE_PATH}/${md5Filename}`);
    });

  // move zip file to failed folder
  fsExtra.exists(zipPath).then((exists) => {
    if (exists) fsExtra.move(zipPath, `${CSV_FAILED_FILE_PATH}/${zipFilename}`);
  });
};

export default Observer;
