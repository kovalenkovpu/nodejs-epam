// eslint-disable-next-line @typescript-eslint/no-var-requires
const { exec } = require('child_process');

const runBuild = async () => {
  try {
    const stdout = await exec('git rev-parse --abbrev-ref HEAD');
    const branchName = stdout.trim();

    console.log(branchName);
  } catch (error) {
    console.log(error);
  }
};

runBuild();
