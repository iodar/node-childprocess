const cp = require("child_process");

const ls = cp.spawn("ls", ["-la", "../../"]);

ls.stdout.on("data", data => {
  const fileInfoArray = fileInfoFromByteStream(data);
  const fileInfoObject = {
    totalSizeInKbyte: 0,
    files: []
  };
  fileInfoArray.forEach((rowContent, index) => {
    if (isLsSizeRow(index)) {
      const lsSize = extractLsSizeFromRow(rowContent);
      fileInfoObject.totalSizeInKbyte = lsSize.sizeInKByte;
    }
    if (isContentRow(index, rowContent)) {
      const fileInfos = extractFileInfoFromRow(rowContent);
      fileInfoObject.files.push(fileInfos);
    }
  });
  console.log(JSON.stringify(fileInfoObject));
});

function isContentRow(index, rowContent) {
  return index > 0 && isNotEmptyRow(rowContent);
}

function isLsSizeRow(index) {
  return index === 0;
}

function isNotEmptyRow(rowContent) {
  return rowContent !== "";
}

function fileInfoFromByteStream(lsData) {
  const lsDataString = lsData.toString();
  const lsDataArray = lsDataString.split("\n");
  return lsDataArray;
}

function extractLsSizeFromRow(lsSizeRow) {
  const whiteSpaces = /\s+/g;
  const [lsSizeString, sizeInKByte] = lsSizeRow.split(whiteSpaces);
  return {
    lsSizeString,
    sizeInKByte
  };
}

function extractFileInfoFromRow(rowContents) {
  const whiteSpaces = /\s+/g;
  const [
    rights,
    numberOfElementes,
    owner,
    group,
    sizeInByte,
    createdMon,
    createdDay,
    createdTime,
    fileName
  ] = rowContents.split(whiteSpaces);
  return {
    fileName,
    fileType: rights.slice(0, 1) === "d" ? "directory" : "file",
    rights: {
      owner: rights.slice(1, 4),
      group: rights.slice(4, 7),
      others: rights.slice(7)
    },
    numberOfElements: numberOfElementes,
    owner,
    group,
    sizeInByte,
    created: {
      string: `${createdMon} ${createdDay} ${createdTime}`,
      month: createdMon,
      day: createdDay,
      time: createdTime
    }
  };
}
