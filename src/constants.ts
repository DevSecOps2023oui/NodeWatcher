const CSV_FILE_PATH = `.${process.env.ENV === "DEV" ? "" : "/dist"}/csv`;
const CSV_NEW_FILE_PATH = `${CSV_FILE_PATH}/new`;
const CSV_PROCESSING_FILE_PATH = `${CSV_FILE_PATH}/processing`;
const CSV_FAILED_FILE_PATH = `${CSV_FILE_PATH}/failed`;
const CSV_COMPLETED_FILE_PATH = `${CSV_FILE_PATH}/completed`;

export {
  CSV_FILE_PATH,
  CSV_NEW_FILE_PATH,
  CSV_PROCESSING_FILE_PATH,
  CSV_FAILED_FILE_PATH,
  CSV_COMPLETED_FILE_PATH,
};
