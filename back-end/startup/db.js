const winston =require('winston');
const mongoose = require('mongoose');
const config=require('config');
module.exports= function (){

    
   /* mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify',false);
    mongoose.set('useCreateIndex',true);
    mongoose.set('useUnifiedTopology', true);*/
    const db=config.get('db');
    mongoose.connect(db,
    {useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:false
   })
        .then(() => logger.info(`Connected to ${db}...`));
}