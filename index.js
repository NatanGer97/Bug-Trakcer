const logEvents = require("./middlewares/logEvents");

const EventEmitter = require('events')
class MyEmitter extends EventEmitter {};

const myEmitter = new MyEmitter();

myEmitter.on('log', (message) => logEvents(message));

setTimeout(()=> {
    myEmitter.emit('log', 'Log Event emitted!');

},2000);