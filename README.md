# NPM Search Bar

A simple app that runs in your system's tray to enable you to search for the best NPM modules.

# Installation

```sh
npm i
npm start
```

# Hacking

In `main.js` be sure to uncomment `// require('electron-debug')({showDevTools: true});` to launch the dev tools every time you run `npm start` (or `electron .`).

You can also refresh the page just as you would in the browser without having to rebuild the app every time.

Finally, `devtron` is installed.  Read more about it [here](http://electron.atom.io/devtron/).

# Packaging

Be sure to generate the `ns-icons.icns` file by running the `bin/create-icons.sh` first.

Then, run

`npm run package`

Currently this builds for Mac but can build for others easily.

# License

MIT