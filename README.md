[![Build Status](https://travis-ci.org/waltz-controls/waltz-tango-rest-plugin.svg?branch=master)](https://travis-ci.org/waltz-controls/waltz-tango-rest-plugin)
![GitHub package.json version](https://img.shields.io/github/package-json/v/waltz-controls/waltz-tango-rest-plugin)

[![Docs](https://img.shields.io/badge/Docs-Generated-green.svg)](https://waltz-controls.github.io/waltz-tango-rest-plugin/)


# waltz-tango-rest-plugin



```bash
npm install @waltz-controls/waltz-tango-rest-plugin --registry=https://npm.pkg.github.com/waltz-controls
```

## Usage

```js
//main.js
app.registerController(new TangoRestController())
   .registerController(new TangoSubscriptionsController())
   .run()
   
   
//foo.js
const rest = await app.getContext(kTangoRestContext)

//bar.js
const subscriptions = await app.getContext(kContextTangoSubscriptions)

//some other.js
app.middleware.subscribe(kAnyTopic,kChannelTangoRest, subscriber)//listen Tango rest channel
app.middleware.subscribe(kAnyTopic,kChannelTango, subscriber)//listen tango channel
```

## Runtime dependencies

1. tango-rest-client
