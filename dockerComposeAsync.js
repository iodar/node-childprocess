const { spawn } = require("child_process");

// todo: 2020-02-15 iodar how to provide params to the promise function?
const dockerCompose = commandString =>
  new Promise((resolve, reject) => {
    const dockerComposeProc = spawn("docker-compose", [commandString]);
    let procByteData = "";
    dockerComposeProc.stdout.on("data", dataChunk => {
      procByteData += dataChunk;
    });

    dockerComposeProc.on("close", exitCode => {
      if (exitCode !== 0) {
        reject(`command failed with exit code ${exitCode}`);
      } else {
        resolve(procByteData);
      }
    });
  });

dockerCompose("-v")
  .then(data => {
    const dataString = data.toString();
    console.log(dataString);
  })
  .catch(err => {
    console.log(err);
  });
