const SSH2Promise = require("ssh2-promise");

const tunnelSSH = async (config) => {
  if (!config || !config.host) {
    return "";
  }

  return new Promise((resolve) => {
    const ssh = new SSH2Promise(config);

    ssh
      .connect()
      .then(() => {
        console.log(config.host + "::Connection established");
        resolve(ssh);
      })
      .catch(() => resolve(""));
  });
};

exports.tunnelSSH = tunnelSSH;
