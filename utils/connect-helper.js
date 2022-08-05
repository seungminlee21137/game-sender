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

const tunnelShell = async (config, command) => {
  if (!config || !config.host) {
    return "";
  }

  return new Promise((resolve) => {
    const ssh = new SSH2Promise(config);

    ssh
      .connect()
      .then(() => {
        console.log(config.host + "::Connection established");
        // resolve(ssh);

        // //use spawn, if you want to stream on output of command
        // ssh.spawn("tail -f /usr/local/tomcat7/logs/catalina.out").then((socket) => {
        //   socket.on("data", () => {
        //     console.log()
        //     //file content will be available here
        //   });
        // });
      })
      .catch(() => resolve(""));
  });
};

exports.tunnelShell = tunnelShell;
