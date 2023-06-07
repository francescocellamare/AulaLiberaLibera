#!/bin/bash


rm orari.txt 
./orari.sh > /dev/null
rm orari.html
node ./index.js
