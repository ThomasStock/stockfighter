# stockfighter
## bundling
Have `npm run watchify` running while coding. 
- bundles app.js and its dependencies to public/js/bundle.js
- starts a watch process that rebundles upon changing a file.
## committing
`./gitpush.sh`
## linting
Run `npm run lint`.
- shortcut for `eslint *.js modules/*.js components/*.js > lintoutput.log`

Keep lintoutput.log open to see updated lint results.

You can also run 'eslint yourfile.js' to easily see lint results of yourfile.
