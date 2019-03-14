const EventEmitter = require('events');

class MyEmitter extends EventEmitter {
}

const myEmitter = new MyEmitter();

myEmitter.on('event', eventName => {
    console.log(`Event [${eventName}] occurred!`);
});

myEmitter.emit('event', "Test event");