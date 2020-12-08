//library to mock function calls
const sinon = require('sinon'); 

const admin = require('firebase-admin');
const test = require('firebase-functions-test')();

describe('Cloud Functions', () => {
    let myFunctions, adminInitStub;
    
    before(() => {
        //stubbing it to be a dummy function
        adminInitStub = sinon.stub(admin, "initializeApp");
        myFunctions = require('../index.js');

    });


    //restore and clean up
    after(() => {
        adminInitStub.restore();
        test.cleanup;
    });
});