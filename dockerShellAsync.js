const { spawn } = require("child_process");

const dockerImageLsAsync = new Promise((resolve, reject) => {
  const dockerImageLsProc = spawn("docker", ["image", "ls"]);
  let procByteData = "";
  dockerImageLsProc.stdout.on("data", dataChunk => {
    procByteData += dataChunk;
  });

  dockerImageLsProc.on("close", exitCode => {
    if (isCommandExecutionUnsuccessful(exitCode)) {
      reject("command failed");
    } else {
      resolve(procByteData);
    }
  });
});

dockerImageLsAsync.then(data => console.log(commandReponseToObject(data)));

function isCommandExecutionUnsuccessful(exitCode) {
  return exitCode !== 0;
}

function commandReponseArrayFromByteStream(byteStreamResponse) {
  const commandResponseString = byteStreamResponse.toString();
  return commandResponseString.split("\n");
}

function commandReponseToObject(byteStreamResponse) {
  const commandResponseArray = commandReponseArrayFromByteStream(
    byteStreamResponse
  );

  const commandResponseObject = {
    dockerImages: []
  };

  commandResponseArray.forEach((rowContent, index) => {
    if (isNotEmptyContentLine(rowContent, index)) {
      const commandReponse = extractCommandReponseFromRow(rowContent);
      commandResponseObject.dockerImages.push(commandReponse);
    }
  });

  return commandResponseObject;
}

function isNotEmptyContentLine(rowContent, index) {
  return index > 0 && isNotEmptyLine(rowContent);
}

function isNotEmptyLine(rowContent) {
  return rowContent !== "";
}

function extractCommandReponseFromRow(rowContent) {
  const whiteSpaces = /\s+/g;
  const [repo, tag, imageId, createdDayAgo, , , size] = rowContent.split(
    whiteSpaces
  );
  return {
    repository: repo,
    tag,
    imageId,
    relativeCreationDate: `${createdDayAgo} day ago`,
    size
  };
}
