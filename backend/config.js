require('dotenv').config();
const port=process.env.PORT || 5000;
const uri=process.env.ATLAS_URI;
const jwtSecret=process.env.JWT_SECRET;
const passphrase=process.env.passphrase;
const config={
    port : port,
    uri : uri,
    jwtSecret : jwtSecret,
    passphrase : passphrase
};
module.exports=config;
