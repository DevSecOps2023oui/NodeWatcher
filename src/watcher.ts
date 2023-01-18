import chokidar from "chokidar";
const EventEmitter = require("events").EventEmitter;
import fsExtra from "fs-extra";
import CheckIntegrity from "./checkIntegrity";
import { CSV_BAD_INTEGRITY_FILE_PATH, CSV_NEW_FILE_PATH } from "./constants";
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
        const CSVContent = await fsExtra.readFile(filePath);

        const CSVFilename = filePath.replace(CSV_NEW_FILE_PATH.replace("./", "") + "/", "");
        // Get only .txt files

        if (CSVFilename.indexOf(".csv") !== -1) {
          // get the csv file

          // Encryption doesn't work yet so we receive a simple .csv file
          // const csvFilename = filename.replace(".txt", ".csv.encrypted");
          const MD5Filename = CSVFilename.replace(".csv", ".txt");

          const MD5Content = await fsExtra.readFile(CSV_NEW_FILE_PATH + "/" + MD5Filename);

          // const md5 = await getMD5(txtContent)
          const md5 = MD5Content.toString();

          // Encryption doesn't work yet
          // const fileContent = decryptData(CSVContent);
          const fileContent = CSVContent;

          // Check integrity of file with MD5 hash
          const isIntegrityGood = CheckIntegrity(fileContent, md5);

          if (isIntegrityGood) {
            // Save data to database
            console.log(
              `[${new Date().toLocaleString()}] File integrity is good, saving data to database`,
            );
            await saveDataToDatabase(CSVFilename, MD5Filename);
          } else {
            // Move file to bad-integrity folder
            console.log(
              `[${new Date().toLocaleString()}] File integrity is bad, move file to bad-integrity folder`,
            );
            fsExtra.moveSync(filePath, `${CSV_BAD_INTEGRITY_FILE_PATH}/${CSVFilename}`, {
              overwrite: true,
            });

            // delete md5 file
            fsExtra.exists(`${CSV_NEW_FILE_PATH}/${MD5Filename}`).then((exists) => {
              if (exists) {
                fsExtra.unlink(`${CSV_NEW_FILE_PATH}/${MD5Filename}`);
              }
            });
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default Observer;
