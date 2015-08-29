#!/bin/sh

#this doesnt work yet

x-terminal-emulator "nodemon -x "npm lint""
x-terminal-emulator nodemon -x "npm test"
x-terminal-emulator npm run watchify

#chmod +x /path/to/dev.sh this gives executatble permissions to this file