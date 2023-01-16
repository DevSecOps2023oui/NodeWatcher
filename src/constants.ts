const CSV_FILE_PATH = `.${process.env.ENV === "DEV" ? "" : "/dist"}/csv`;
const CSV_NEW_FILE_PATH = `${CSV_FILE_PATH}/new`;
const CSV_BAD_INTEGRITY_FILE_PATH = `${CSV_FILE_PATH}/bad-integrity`;
const CSV_HISTORY_FILE_PATH = `${CSV_FILE_PATH}/history`;

export { CSV_BAD_INTEGRITY_FILE_PATH, CSV_FILE_PATH, CSV_NEW_FILE_PATH, CSV_HISTORY_FILE_PATH };
