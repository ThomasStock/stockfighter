# StockFighter

## Running

#### On c9.io platform
Rightclick `httpserver.js` and click `Run`

#### On generic node.js servers
Run `node httpserver.js`

## Bundling
Have `npm run watchify` running while coding. 
- bundles app.js and its dependencies to public/js/bundle.js
- starts a watch process that rebundles upon changing a file.

## Committing
Run `./gitpush.sh`

## Linting
Run `npm run lint`.
- shortcut for `eslint *.js modules/*.js components/*.js > lintoutput.log`

Keep lintoutput.log open to see updated lint results.

You can also run 'eslint yourfile.js' to easily see lint results of yourfile.

## Testing
Run `npm run test` or `jasmine`.

## Automatic testing and linting
Run `nodemon -x "npm test"`
Run `nodemon -x "npm lint"`