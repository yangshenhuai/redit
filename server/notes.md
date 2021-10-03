download from here. 
https://nodejs.org/en/download/

and install node following https://medium.com/@rabbi.cse.sust.bd/install-nodejs-via-binary-archive-on-ubuntu-18-04-63118473d9e9

key 
export NODEJS_HOME=/opt/node-v10.1.0-linux-x64/bin  
export PATH=$NODEJS_HOME:$PATH




* npm init -y 
  * init the project

* sudo npm install -g yarn
* yarn add -D @types/node typescript 
 
* add nodemon, can auto restart if the js changes  `yarn global add nodemon`
*  add mikro-orm `yarn add @mikro-orm/core @mikro-orm/postgresql @mikro-orm/cli @mikro-orm/cli pg`
*  add the mikro-orm configuration in package.json
*  run ` npx mikro-orm migration:create --initial` 
*  run `yarn add express apollo-server-express graphql type-graphql`
*  run `yarn add -D @types/express`

