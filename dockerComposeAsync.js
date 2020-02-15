const { spawn } = require("child_process");

// todo: 2020-02-15 iodar how to provide params to the promise function?
const dockerCompose = new Promise((resolve, reject) => {
  const dockerComposeProc = spawn("docker-compose", ["--version"]);
  let procByteData = "";
  dockerComposeProc.stdout.on("data", dataChunk => {
    procByteData += dataChunk;
  });

  dockerComposeProc.on("close", exitCode => {
    if (exitCode !== 0) {
      reject("command failed");
    } else {
      resolve(procByteData);
    }
  });
});

dockerCompose.then(data => {
  const dataString = data.toString();
  console.log(dataString);
});
