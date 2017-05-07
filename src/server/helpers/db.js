let mongoose=require("mongoose");
let isDev=process.env.NODE_ENV === "dev";

let url=isDev?
    "mongodb://localhost:27017/news_collect":
    "mongodb://lowesyang:19951102@localhost:27017/news_collect";

mongoose.connect(url,{
    server:{
        poolSize:4
    }
});

mongoose.Promise=global.Promise;

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
    console.log('Mongoose default connection open to ' + url);
});
// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});
// When the connection is disconnected
mongoose.connection.on('disconnected', function () {
    console.log('Mongoose default connection disconnected');
});
// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose default connection disconnected through app termination');
        process.exit(0);
    });
});

module.exports=mongoose.connection;