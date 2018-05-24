'use strict';

const Promise = require('bluebird'),
  cp = Promise.promisifyAll(require('child_process'));

class CheckingServices{

  apache2(){
    // Check if apache2 can still handle connexions
    cp.execAsync('sudo service apache2 status').then((stdout, stderr) =>{
      let apacheForks = new RegExp(/\/usr\/sbin\/apache2/g);
      let nbOfApacheForks = stdout.match(apacheForks).length;
      if(!apacheForks){
        console.error('No more Apache fork.. will restart them');
        this.restartApache();
        return;
      }
    }).catch(error=>{
      console.error('Cannot stats apache2 status');
      this.restartApache();
      return;
    })
  }

  php(phpServicename){
    // Check if php can still handle connexions
    cp.execAsync(`sudo service ${phpServicename} status`).then((stdout, stderr) =>{
      // console.log(stdout);
      let phpForks = new RegExp(/pool/g);
      let nbOfphpForks = stdout.match(phpForks).length;
      // no more php fork to handle request
      if(!nbOfphpForks){
        this.restartPhp(phpServicename);
        console.error('Php service restarted')
      }
    }).catch(error=>{
      // error while checking, restart php
      this.restartPhp(phpServicename);
      return;
    })
  }

  restartApache(){
    let result = cp.exec('sudo service apache2 restart');
  }

  restartPhp(command){
    let result = cp.execSync(`sudo service ${command} restart`);
    console.log(`Restarted ${command}`)
  }
}

module.exports = CheckingServices;