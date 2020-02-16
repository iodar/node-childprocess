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
  .then(data => console.log(data.toString()))
  .catch(err => console.log(err));
