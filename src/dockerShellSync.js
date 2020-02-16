const cp = require("child_process");

const dockerImageLs = cp.spawnSync("docker", ["image", "ls"]);

console.log(commandReponseToObject(dockerImageLs.stdout));

function commandReponseArrayFromByteStream(byteStreamResponse) {
  const commandResponseString = byteStreamResponse.toString();
  return commandResponseString.split("\n");
}

function commandReponseToObject(byteStreamResponse) {
  const commandResponseArray = commandReponseArrayFromByteStream(
    byteStreamResponse
  );

  const commandResponseObject = {
    images: []
  };

  commandResponseArray.forEach((rowContent, index) => {
    if (index > 0 && rowContent !== "") {
      const commandReponse = extractCommandReponseFromRow(rowContent);
      commandResponseObject.images.push(commandReponse);
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
