require('dotenv').config();
const mongoose = require('mongoose');
const url = process.env.MONDO_CONNECTION_URL;
function connectDB(){
    // Database connection
//  const url = `Connection String`;

 const connectionParams = {
   useNewUrlParser: true,
   useUnifiedTopology: true,
 };
 mongoose.connect(url, connectionParams).then(() => {
     console.log("Connected to the database ");
   })
   .catch((err) => {
     console.error(`Error connecting to the database. n${err}`);
   });
    
};


// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client.connect((err) => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });

module.exports = connectDB;