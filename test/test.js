'use strict';

const pkg = require('../package.json'),
  chai = require('chai'),
  expect = chai.expect;

const Promise = require('bluebird'),
  cp = Promise.promisifyAll(require('child_process'));

it.optional = require('it-optional');

// Dependencies tests
describe('Check requirements', function () {

  it('Should be able to use sudo without error', function (done) {
    cp.execAsync('sudo service --status-all').then((stdout, stderr) =>{
      if(stdout && stdout.includes('[')){
        done();
        return;
      }
      done(new Error('Cannot access sudo or services, maybe your are not on debian/ubuntu'));
    }).catch(error=>done(error));
  })

  it('Should have apache2 in the status list', function (done) {
    cp.execAsync('sudo service --status-all').then((stdout, stderr) =>{
      if(stdout && stdout.includes('apache2')){
        done();
        return;
      }
      done(new Error('Is Apache2 installed ?'));
    }).catch(error=>done(error));
  })

  it('Should not be able to access Apache2 because it does not exists dude ..', function (done) {
    cp.execAsync('sudo service --status-all').then((stdout, stderr) =>{
      if(stdout && stdout.includes('apache3')){
        done(new Error('Apache3 is running.. the program have a big mistake'));
        return;
      }
      done();
    }).catch(error=>done(error));
  })

  // it.optional('Should have php running in service to be able to restart it (optional)', function (done) {
  //   cp.execAsync('sudo service --status-all').then((stdout, stderr) =>{
  //     if(stdout && stdout.includes('php')){
  //       done();
  //     }else{
  //       done(new Error('Check if php in fpm or something like mod ?'));
  //     }
  //   }).catch(error=>done(error));
  // })

});

describe('Check Class', function(){
  it('Should restart apache2 if it is not started', function(done){
    const CheckingServices = require('../check.js');
    let check = new CheckingServices();
    // first stop apache
    cp.execSync('sudo service apache2 stop');
    cp.exec('sudo service apache2 status', function(err, stdout, stderr){
      expect(stdout).to.include('dead');
      expect(stdout).to.not.include('running');
      check.apache2();
      // Simulate an apache restart
      setTimeout(function(){
        cp.exec('sudo service apache2 status', function(err, stdout, stderr){
          expect(stdout).to.include('running');
          expect(stdout).to.not.include('dead');
          check.apache2();
          done();
        });
      },1000)
    })
  })
})