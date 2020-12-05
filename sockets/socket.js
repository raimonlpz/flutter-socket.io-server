const { io } = require('../index');
const Band = require('../models/band');
const Bands = require('../models/bands');

const bands = new Bands();
bands.addBand(new Band( 'Queen' ));
bands.addBand(new Band( 'BonJovi' ));
bands.addBand(new Band( 'RHCP' ));
bands.addBand(new Band( 'Nirvana' ));
bands.addBand(new Band( 'Rihanna' ));

console.log(bands);

// Socket Messages
io.on('connection', client => {
    console.log('client connected');

    client.emit('active-bands', bands.getBands());

    client.on('disconnect', () => {
        console.log('client disconnected')
    });

    client.on('message', data => {
        console.log(data);
        // io.emit( 'message', {admin: 'nuevo mensaje'} );
    })

    client.on('vote-band', (payload) => {
        bands.voteBand( payload.id );
        io.emit('active-bands', bands.getBands());
    });

    client.on('add-band', (payload) => {
        const newBand = new Band(payload.name);
        bands.addBand(newBand);
        io.emit('active-bands', bands.getBands());
    });

    client.on('delete-band', (payload) => {
        bands.deleteBand(payload.id);
        io.emit('active-bands', bands.getBands());
    });

    // client.on('emit-message', payload => {
    //     // emite a TODOS los clientes
    //     // io.emit('new-message', payload);
    //     console.log(payload);
    //     // emite a todos los clientes menos al que emite
    //     client.broadcast.emit('new-message', payload)
    // });
});