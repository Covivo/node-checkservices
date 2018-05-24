'use strict';

const Promise = require('bluebird'),
  cp = Promise.promisifyAll(require('child_process')),
  CheckingServices = require('./check.js'),
  listOfServices = cp.execSync('sudo service --status-all'),
  pkg = require('./package.json'),
  program = require('commander');
 
program
  .version(pkg.version)
  .option('-t, --time <n>', 'Time (in s) to check status')
  .parse(process.argv);

let phpReg = new RegExp(/\s+php.*/g);
let phpServicename = listOfServices.toString().match(phpReg) && listOfServices.toString().match(phpReg)[0].trim();

let check = new CheckingServices();

setInterval(function (argument) {
  check.apache2();
  if(phpServicename){
    check.php(phpServicename);
  }
},(program.time && program.time*1000)||180000);