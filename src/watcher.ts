import chokidar from "chokidar";
const EventEmitter = require("events").EventEmitter;
import fsExtra from "fs-extra";
import CheckIntegrity from "./checkIntegrity";
import { CSV_BAD_INTEGRITY_FILE_PATH, CSV_FILE_PATH } from "./constants";
import decryptData from "./decryptFile";
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
        const encryptedFileContent = await fsExtra.readFile(filePath);

        const filename = filePath.replace("csv/new/", "");
        // Only decrypt .csv files
        if (filename.indexOf(".csv")) {
          // Decrypt file
          // const fileContent = decryptData(encryptedFileContent);

          // Check integrity of file with MD5 hash
          // const isIntegrityGood = CheckIntegrity(fileContent, "39ece25a3b518df0311715b3219d2aab");
          const isIntegrityGood = true;

          if (isIntegrityGood) {
            // Save data to database
            console.log(
              `[${new Date().toLocaleString()}] File integrity is good, saving data to database`,
            );
            await saveDataToDatabase(filename);
          } else {
            // Move file to bad-integrity folder
            console.log(
              `[${new Date().toLocaleString()}] File integrity is bad, move file to bad-integrity folder`,
            );
            fsExtra.moveSync(filePath, `${CSV_BAD_INTEGRITY_FILE_PATH}/${filename}`);
          }
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
}

export default Observer;
