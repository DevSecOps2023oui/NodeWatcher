import { config } from "dotenv";
import express from "express";
import { CSV_NEW_FILE_PATH } from "./src/constants";
import Obserser from './src/watcher';

const app = express();
const port = 2200;
config();



var obserser = new Obserser();

const folder = CSV_NEW_FILE_PATH;

obserser.watchFolder(folder);


app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
