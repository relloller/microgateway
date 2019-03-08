"use strict";

const commander = require("commander");
const cert = require("./lib/cert")();
const prompt = require("cli-prompt");

const setup = function setup() {
  commander
    .command("install")
    .option("-o, --org <org>", "the organization")
    .option("-e, --env <env>", "the environment")
    .option("-t, --token <token>", "OAuth token to use with management API")
    .option("-u, --username", "username of the organization admin")
    .option("-p, --password", "password of the organization admin")
    .option("-f, --force", "replace any existing keys")
    .description("install a certificate for your organization")
    .action(options => {
      options.error = optionError;
      options.token = options.token || process.env.EDGEMICRO_SAML_TOKEN;
      options.org = options.org || process.env.EDGEMICRO_ORG;
      options.env = options.env || process.env.EDGEMICRO_ENV;
      options.username = options.username || process.env.EDGEMICRO_USER;
      options.password = options.password || process.env.EDGEMICRO_PASSWORD;

      if (options.token) {
        if (!options.org) {
          return options.error("org is required");
        }
        if (!options.env) {
          return options.error("env is required");
        }
        cert.installCert(options);
      } else {
        if (!options.username) {
          if (!options.org) {
            return options.error("org is required");
          }
          if (!options.env) {
            return options.error("env is required");
          }
          promptForPassword(options, options => {
            if (!options.password) {
              return options.error("password is required");
            }
            cert.installCert(options);
          });
        }
      }
    });

  commander
    .command("delete")
    .option("-o, --org <org>", "the organization")
    .option("-e, --env <env>", "the environment")
    .option("-u, --username", "username of the organization admin")
    .option("-t, --token <token>", "OAuth token to use with management API")
    .option("-p, --password", "password of the organization admin")
    .description("delete the certificate for your organization")
    .action(options => {
      options.error = optionError;

      if (options.token) {
        if (!options.org) {
          return options.error("org is required");
        }
        if (!options.env) {
          return options.error("env is required");
        }
        cert.deleteCert(options);
      } else {
        if (!options.username) {
          return options.error("username is required");
        }
        promptForPassword(options, options => {
          if (!options.password) {
            return options.error("password is required");
          }
          cert.deleteCert(options);
        });
      }
    });

  commander
    .command("check")
    .option("-o, --org <org>", "the organization")
    .option("-e, --env <env>", "the environment")
    .option("-t, --token <token>", "OAuth token to use with management API")
    .option("-u, --username <user>", "username of the organization admin")
    .option("-p, --password <password>", "password of the organization admin")
    .description("check that your organization has a certificate installed")
    .action(options => {
      options.error = optionError;
      if (!options.org) {
        return options.error("org is required");
      }
      if (!options.env) {
        return options.error("env is required");
      }
      if (options.token) {
        cert.checkCert(options);
      } else {
        if (!options.username) {
          return options.error("username is required");
        }
        promptForPassword(options, options => {
          if (!options.password) {
            return options.error("password is required");
          }
          cert.checkCert(options);
        });
      }
    });

  commander
    .command("public-key")
    .option("-o, --org <org>", "the organization")
    .option("-e, --env <env>", "the environment")
    .description("retrieve the public key")
    .action(options => {
      options.error = optionError;
      if (!options.org) {
        return options.error("org is required");
      }
      if (!options.env) {
        return options.error("env is required");
      }
      cert.retrievePublicKey(options);
    });

  commander.parse(process.argv);

  var running = false;
  commander.commands.forEach(function(command) {
    if (command._name == commander.rawArgs[2]) {
      running = true;
    }
  });
  if (!running) {
    commander.help();
  }
};
function optionError(message) {
  console.error(message);
  this.help();
}
// prompt for a password if it is not specified
function promptForPassword(options, cb) {
  if (options.password) {
    cb(options);
  } else {
    prompt.password("password:", function(pw) {
      options.password = pw;
      cb(options);
    });
  }
}

module.exports = setup;
