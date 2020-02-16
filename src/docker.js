const { spawn } = require("child_process");

/**
 * Executes docker command with the provided args.
 *
 * ----
 *
 * Example:
 *
 * `docker(["ps", "-a"]).then(data => console.log(data.toString()))`
 * @param {string[]} dockerCommandAndArgs docker command with args
 */
function docker(dockerCommandAndArgs) {
  return new Promise((resolve, reject) => {
    const dockerProc = spawn("docker", dockerCommandAndArgs);

    let procByteData = "";
    dockerProc.stdout.on("data", dataChunk => {
      procByteData += dataChunk;
    });

    dockerProc.on("close", exitCode => {
      if (exitCode !== 0) {
        reject(`command failed with exit code ${exitCode}`);
      } else {
        resolve(procByteData);
      }
    });
  });
}

docker(["ps", "-a"])
  .then(data => console.log(objectFromByteData(data)))
  .catch(err => console.log(err));

function objectFromByteData(byteData) {
  const byteDataAsString = byteData.toString();
  const dataArray = arrayFromDataString(byteDataAsString);
  let responseObject = {
    containers: []
  };
  dataArray.forEach((arrayRow, index) => {
    if (isNotEmptyContentRow(index, arrayRow)) {
      const containerData = extractDataFromDataArrayRow(arrayRow);
      responseObject.containers.push(containerData);
    }
  });
  return responseObject;
}

function isNotEmptyContentRow(index, arrayRow) {
  return index > 0 && !isEmptyRow(arrayRow);
}

function isEmptyRow(arrayRow) {
  return arrayRow === "";
}

function extractDataFromDataArrayRow(dataArrayRow) {
  const whiteSpace = /\s+/g;
  const [containerId, imageName] = dataArrayRow.split(whiteSpace);
  return {
    containerId,
    imageName
  };
}

function arrayFromDataString(dataString) {
  return dataString.split("\n");
}
