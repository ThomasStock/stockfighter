#!/bin/sh

nodemon -x "npm lint"
nodemon -x "npm test"
npm run watchify