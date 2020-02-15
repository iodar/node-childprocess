const { spawn } = require("child_process");

const dockerImageLsAsync = new Promise((resolve, reject) => {
  const dockerImageLsProc = spawn("docker", ["image", "ls"]);
  let procData = "";
  dockerImageLsProc.stdout.on("data", dataChunk => {
    procData += dataChunk;
  });

  dockerImageLsProc.on("close", exitCode => {
    if (exitCode !== 0) {
      reject("command failed");
    } else {
      resolve(procData);
    }
  });
});

dockerImageLsAsync.then(data => console.log(commandReponseToObject(data)));

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
    if (index > 0 && rowContent !== "") {
      const commandReponse = extractCommandReponseFromRow(rowContent);
      commandResponseObject.dockerImages.push(commandReponse);
    }
  });

  return commandResponseObject;
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
