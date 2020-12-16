const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.addUser = functions.region('europe-west3').firestore.document('Users/{documentId}')
    .onCreate(snapshot => 
        db.collection('Prototypes').doc('index').get()
        .then(doc => {
            let val = {}
            Object.keys(doc.data()).forEach(key => {
                val[key] = {
                    "srs": doc.data()[key].lvl === 1 ? 0 : -1,
                    "due": null
                }
            })
            return val
        })
        .then(store => {
            db.collection('Users').doc(snapshot.id).collection('Items').doc("index").set(store)
            return 0;
        })
        .catch(error => {
            console.log("Error: ", error);
            return -1;
        })
    )