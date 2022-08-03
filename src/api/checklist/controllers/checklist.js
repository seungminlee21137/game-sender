"use strict";

const { tunnelSSH } = require("../../../../utils/connet-helper");
const sshconfig = {
  host: "10.100.2.4",
  username: "happytuk",
  password: "happytuk5377!",
};

module.exports = {
  async deployWeb() {
    const webservers = strapi.config.get("server.server_live.jcgf");
    const result = {};

    for (let i = 0; i < webservers.length; i++) {
      sshconfig.host = webservers[i];

      const _server = await tunnelSSH(sshconfig);

      if (_server) {
        const commands = await _server.exec(
          "ls /usr/local/tomcat7/webapps/ROOT.war --time-style=long-iso -lrg"
        );

        const command = commands.split(" ");
        const targetHost = sshconfig.host;
        const targetValue = `${command[6]}::[${command[3]}]::${command[4]} ${command[5]}`;

        result[`${targetHost}`] = targetValue;

        _server.close();
      }
    }

    return result;
  },

  async deployApi() {
    const webservers = strapi.config.get("server.server_live.happycode");
    const result = {};

    for (let i = 0; i < webservers.length; i++) {
      sshconfig.host = webservers[i];

      const _server = await tunnelSSH(sshconfig);

      if (_server) {
        const commands = await _server.exec(
          "ls /usr/local/tomcat7/webapps/ROOT.war --time-style=long-iso -lrg"
        );

        const command = commands.split(" ");
        const targetHost = sshconfig.host;
        const targetValue = `${command[6]}::[${command[3]}]::${command[4]} ${command[5]}`;

        result[`${targetHost}`] = targetValue;

        _server.close();
      }
    }

    return result;
  },
};
