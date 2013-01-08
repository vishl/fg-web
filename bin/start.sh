#! /bin/sh
#This uses supervisor to watch for changes in the current directory and restart the app automatically
#It will also pause restarting if an error is detected
#Run with bin/start.sh
supervisor -w . -n error --debug app.js
