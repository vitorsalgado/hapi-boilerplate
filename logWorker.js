'use strict';

const Carrier = require('carrier');
const Emitter = Carrier.carry(process.stdin);

Emitter.on('close', () => process.exit());

Emitter.on('line', (data) => {

});
