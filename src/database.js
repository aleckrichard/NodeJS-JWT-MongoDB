const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/mongojwt',{
    useNewUrlParser: true
}).then(db => console.log('database is connected') )