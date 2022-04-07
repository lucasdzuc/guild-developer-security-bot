const mongoose = require('mongoose');

const URI = process.env.MONGODB_URI;

mongoose.connect(URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useFindAndModify: false,
}).then(() => {
    console.log("Connection successful!")
}).catch((err) => {
    console.log("No connection!", err);
});

// const connection = mongoose.connection;
// connection.once('open', () => {
//     console.log("Mongo Connected!");
// });

mongoose.Promise = global.Promise;

module.exports = mongoose;