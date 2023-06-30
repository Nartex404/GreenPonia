//Based in tutorial: https://decimodan.com/blog/2020/creando-tu-primer-api-con-nodejs-y-firebase-cloud-functions/
//We imports dependences requires
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const app = express();
const path = require('path');

//const credentials = require("./credentials");

//We initialize the credentials to admin the data base of firestore
admin.initializeApp({
   credential: admin.credential.applicationDefault(), //---> for local: admin.credential.cert(credentials),
   databaseURL: 'https://webhook-ea0a1.firebaseio.com' //'https://<DATABASE_NAME>.firebaseio.com'
})

// Config of the path dof view
app.set('views', path.join(__dirname, '../view'));
app.set('view engine', 'ejs');

// Config of the path file static
app.use(express.static(path.join(__dirname, '../public')));

//Call to databse
const db = admin.firestore();

//Accept any request (GET, POST, PUT, etc)
app.all('*', async (req, res) => {
   let payload = req.body;
   const id_timestamp = new Date().getTime();
   try {

      //Insert data to firestore
      if (req.url === '/uplinks') {

         //We create an collection named 'agroclima
         const namedb = db.collection('agroclima');

         ///////We test if the payload is not undefined
         if (payload.uplink_message.decoded_payload.system !== undefined) {
            //Used to monitor the functioning hardware. Save in the document called 'start_system'
            await namedb.doc('start_system').set({
               system: payload.uplink_message.decoded_payload.system
            });
         } else {
            //////////////If  the payload of document 'start_system' is undefined but the payload
            ///////////// of data from sensor yes, so we save the data.
            //Save data. used for chart history.
            var dataInsert = {
               timestamp: id_timestamp,
               hum: payload.uplink_message.decoded_payload.hum,
               temp: payload.uplink_message.decoded_payload.temp,
               cond: payload.uplink_message.decoded_payload.cond,
               ph: payload.uplink_message.decoded_payload.ph,
               crec: payload.uplink_message.decoded_payload.crec
            }
            await namedb.doc('/' + id_timestamp + '/').set(dataInsert);

            //Used to realtime data
            await namedb.doc('realtime').set(dataInsert);
         }

         return res.status(200).send();
      }
      ////Get data from firestore
      if (req.url === '/data') {
         const query = db.collection('agroclima');
         const raw = await query.get();
         //Get all docs
         const data = raw.docs;
         //Get all data of every doc inside the collection 'agroclima'
         const response = data.map((doc) => ({
            id: doc.id,
            hum: doc.data().hum,
            temp: doc.data().temp,
            cond: doc.data().cond,
            ph: doc.data().ph,
            crec: doc.data().crec
         }))
         //We show all data except the 'realtime' and 'start_system' documents
         const filterdata = response.filter((item) => item.id !== 'realtime' && item.id !== 'start_system');

         return res.status(200).send(filterdata);
      }


      res.render('index');
      return res.status(200).send();

   } catch (err) {
      console.log(err);
   }
})

//Export the app express as a function of cloud functions
exports.app = functions.https.onRequest(app);


//For production with https, enable permissions in the powershell:
// $env:GOOGLE_APPLICATION_CREDENTIALS="C:\Users\57321\Downloads\credentials.json"


//API-KEY THE THING STACK --> NNSXS.SI4ZQ6FHI3RLSIP75PWI2PQPM2ZWVLSUFD5532A.HGULM7KZUIIIPINMJTEPU7DBKYW47K67HQCYYHBTH5GMA7CU6HNQ

////////Comands firebase:
//for run local: firebase serve
/// for run production:  firebase deploy --only functions    or also: firebase deploy.