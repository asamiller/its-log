It's Log
=======

It's Log, Log, it's better than bad, it's good!

![](https://i.imgflip.com/9pbz9.gif)


## Install
`package.json`: `"its-log": "git://github.com/asamiller/its-log.git"`

`.env`: `ITSLOG_API_KEY=foo` `ITSLOG_COLLECTION=bar`

## Usage
```
var itsLog = require('its-log');
var log = new itsLog({
    file: 'app.js',
    tags: ['backend']
    console: true
});
```

```
log.info('This is my log message #debug #moretags', {extra: 'data'});
```
