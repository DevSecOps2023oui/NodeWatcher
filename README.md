# Node watcher

This is a simple node watcher that will watch a <span style="color:lightblue">csv/new</span> folder for added files.

## Packages

Here are the packages used:

- @prisma/client: Used to connect to the database
- chokidar: Used to watch the folder
- decompress: Used to unzip the zip file
- dotenv: Used to load environment variables
- express: Used to create a simple server
- fs-extra: Used to move, delete and copy files
- md5: Used to check if the csv file has the same md5 hash as the one in the txt file

## Process

Here is the process:

1. A file is added to the <span style="color:lightblue">csv/new</span> folder
2. It check if the file is a zip file
3. If it is a zip file, it will unzip in <span style="color:lightblue">csv/processing</span> folder. Else it will move it to <span style="color:lightblue">csv/failed</span> folder
4. It will then check if the zip file contains a csv file and a txt file
5. If it does, it will check if the csv file has the same md5 hash as the one in the txt file. Else it will move it to <span style="color:lightblue">csv/failed</span> folder
6. If it does, it will process the csv file to insert data in the database
7. After processing, it will move the zip file to <span style="color:lightblue">csv/completed</span> folder and delete the csv and txt files from <span style="color:lightblue">csv/processing</span> folder

## Installation

1. Clone the repository
2. Run `npm install`
3. Create a database on your local machine and run the `schema.sql` file for this database
4. Create a .env file and add the following variables
5. Run `npm start` to start the server

## How to test

Move one of the zip files to the <span style="color:lightblue">csv/new</span> folder. It will be processed and moved to <span style="color:lightblue">csv/completed</span> folder or moved to <span style="color:lightblue">csv/failed</span> folder if it does not meet the requirements.

## Build for production

Run `tsc` command to build the project. The build files will be in the `dist` folder.