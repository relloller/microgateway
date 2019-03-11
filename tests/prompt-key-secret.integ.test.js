const { spawnSync, spawn } = require('child_process');
const assert = require('assert');
const path = require('path');
const { org, env, user, password, key, secret } = require('./env.js');
const cliPath = path.join(__dirname, '..', 'cli', 'edgemicro');

describe('CLI prompts for key & secret', done => {
  it('edgemicro verify prompts for key & secret', done => {
    let verifier = spawn(cliPath, ['verify', '-e', env, '-o', org]);
    let outData = [];
    verifier.stdout.on('data', data => {
      outData.push(data);
      let outDataStr = Buffer.concat(outData).toString();
      if (outDataStr.includes('key:')) {
        outData = [];
        verifier.stdin.write(`${key}\n`);
      }
      if (outDataStr.includes('secret:')) {
        outData = [];
        verifier.stdin.write(`${secret}\n`);
      }
      if (outDataStr.includes('verification complete')) {
        done();
      }
    });
  });
});
