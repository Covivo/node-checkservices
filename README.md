# node-checkservices
Npm module to check apache/php on debian/ubuntu services  &amp; restart them automatically when needed
For exemple, when all php-fpm worker have crashed or when apache has no more process to handle request

## Requirements


-  Debian/Ubuntu (do not know elsewhere)
-  Service available
-  Sudo rights without password (add user to sudo)


## Install


`git clone https://github.com/Covivo/node-checkservices`

`cd node-checkservices && npm install && npm run test`

If npm test failed, it's not possible to use this module on your config (maybe you do not have sudo rights,maybe not apache installed, or services command is not available)


## Usage


The best way is to start it in a screen, it will log error if there are


`screen -R myScreen `

`node index.js`

## Help


`node index.js --help` will output

  ```Options:

    -V, --version   output the version number
    -t, --time <n>  Time (in s) to check status || default is 3minutes
    -h, --help      output usage information
  ```
