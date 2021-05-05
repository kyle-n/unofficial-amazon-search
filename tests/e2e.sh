#!/bin/bash

npm link
rm -rf tester
mkdir tester
cd tester
npm init -y
npm link unofficial-amazon-search
touch server.js
printf "const {searchAmazon} = require('unofficial-amazon-search');\nsearchAmazon('lamp').then(data => console.log(data.searchResults.length > 0));" > server.js
node server.js | grep 'true' &> /dev/null
if [ $? == 0 ];
then
  cd ..
  rm -rf tester
  echo "Passed"
else
  cd ..
  rm -rf tester
  echo "No results returned"
  exit 1
fi