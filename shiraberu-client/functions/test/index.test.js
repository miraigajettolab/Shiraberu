
//Requires emulators
//You can run them with this command (in a separate terminal)
//firebase emulators:start
//Then run npm test or "mocha --reporter spec"

const assert = require("assert")
const firebase = require("@firebase/testing")  
const projectId = "shirabe-ru";
const admin = firebase.initializeAdminApp({ projectId });

beforeEach(async function() {
    this.timeout(0);
    await firebase.clearFirestoreData({ projectId });
    const testIndexRef = admin
        .firestore()
        .collection("Prototypes")
        .doc("index");
    //Describing two prots: lvl 1 radical and lvl 50 radical
    const indexData = {"1": {"lvl":1,"pos":1,"type":"R"},"8000": {"lvl":50,"pos":1,"type":"R"} };
    await testIndexRef.set(indexData);
});

//Time for function to do it's job
async function snooz(time = 3000) {
    return new Promise(resolve => {
        setTimeout(e => {
            resolve();
        }, time);
    });
}

it("Add User", async function() {
    this.timeout(0);
    const testUserRef = admin
        .firestore()
        .collection("Users")
        .doc("TEST_USER");

    //add user to the db
    const userData = { email: "testuser@test.test" };
    await testUserRef.set(userData);

    // wait until the function is done.
    await snooz();

    // check if user's index is correctly created
    const testUserIndexRef = admin
        .firestore()
        .collection("Users")
        .doc("TEST_USER")
        .collection("Items")
        .doc("index");
    const userIndex = await testUserIndexRef.get();
    //Because the prot is from lvl 1 srs should be 0 (unlocked)
    assert.deepStrictEqual(userIndex.data()['1'].srs, 0);
    //Because the prot is from lvl 50 srs should be -1 (locked)
    assert.deepStrictEqual(userIndex.data()['8000'].srs, -1);
});