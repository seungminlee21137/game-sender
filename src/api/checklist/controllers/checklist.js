"use strict";

const fs = require("fs");
const { promises } = require("fs");
const util = require("util");

// const log_file = fs.createWriteStream(__dirname + "/debug.log", { flags: "w" });
const { tunnelSSH } = require("../../../../utils/connect-helper");

const sshconfig = {
  host: "10.100.2.4",
  username: process.env.ssh_username, // env.username
  password: process.env.ssh_password, //env.password
  readyTimeout: 10000, // default: 20000
};

module.exports = {
  /**
   * jcgf, happycode 공통 사용
   * 요청서버의 war 정보를 가져온다.
   * -rw-rw-r--. 1 happytuk 52277210 2022-08-11 16:29 /usr/local/tomcat7/webapps/ROOT.war
   *
   */
  async warcheck(ctx) {
    const { serverip = "" } = ctx.params;

    if (!serverip) {
      return { ip: "" };
    }
    // connet-server
    sshconfig.host = serverip;
    const result = {};

    const _server = await tunnelSSH(sshconfig);

    // 임시경로: /home/happytuk/target/
    // 이동경로: /usr/local/tomcat7/webapps/
    if (_server) {
      const commands = await _server.exec(
        "ls /usr/local/tomcat7/webapps/ROOT.war --time-style=long-iso -lrg"
      );

      const command = commands.split(" ");

      result.ip = serverip;
      result.size = command[3];
      result.releaseDate = `${command[4]} ${command[5]}`;

      _server.close();
    }

    return result;
  },
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
          "ls /home/happytuk/target/ROOT.war --time-style=long-iso -lrg"
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
  async serverlogTail(ctx) {
    const { ip = "" } = ctx.params;

    if (!ip) {
      return { result: "invaild_ip_address" };
    }

    const webServers = strapi.config.get("server.server_live.jcgf");
    const apiServers = strapi.config.get("server.server_live.happycode");

    let isWebSever = false;
    let isApiSever = false;

    if (webServers.indexOf(ip) > -1) {
      isWebSever = true;
    } else if (apiServers.indexOf(ip) > -1) {
      isApiSever = true;
    }

    if (!isWebSever && !isApiSever) {
      return { result: `${ip}_not_server_ip` };
    }

    sshconfig.host = ip;

    // 파일로드
    async function loadMonoCounter(filepath) {
      const data = await promises.readFile(filepath, "binary");
      return Buffer.from(data);
    }
    // 파일 체크
    const loadFileExists = async (path) =>
      !!(await fs.promises.stat(path).catch((e) => false));

    // D://debug_{ip}.txt
    const pathAndFile = `D://debug_${ip}.txt`;
    const isExigst = await loadFileExists(pathAndFile);
    console.log(`isExigst`, isExigst);

    let log_file = "";
    let tailinfo = "";
    if (isExigst) {
      // log_file = await loadMonoCounter(pathAndFile);
      fs.unlink(pathAndFile, function (err) {
        if (err) throw err;
        console.log(pathAndFile + "File deleted!");
      });
      log_file = fs.createWriteStream(pathAndFile, { flags: "w" });
    } else {
      log_file = fs.createWriteStream(pathAndFile, { flags: "w" });
    }

    const _server = await tunnelSSH(sshconfig);

    if (_server) {
      try {
        _server
          .spawn("tail -f /usr/local/tomcat7/logs/catalina.out")
          .then((socket) => {
            socket.on("data", (loginfo) => {
              const taillog = loginfo.toString("utf-8");
              console.log(taillog);
              // save to logfile
              console.log = (taillog) => {
                log_file.write(util.format(taillog) + "\n");
              };
            });
          });
      } catch (err) {
        if (_server) {
          _server.close();
        }
      }

      return { result: pathAndFile, log: log_file };
    } else {
      return { result: "connect.fail" };
    }
  },
};
