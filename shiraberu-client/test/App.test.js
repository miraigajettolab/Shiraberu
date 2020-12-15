import React from 'react';
import App from '../src/App'
import * as firebase from 'firebase'
import { shallow } from 'enzyme';

let USER = {}
let LAST_SIGN_IN_TIME
let CREATION_TIME

//Mocks

const onAuthStateChanged = jest.fn((user) => {
  setTimeout(1000)
  user(USER)
})

const getRedirectResult = jest.fn(() => {
  return Promise.resolve({
    user: {
      displayName: 'redirectResultTestDisplayName',
      email: 'redirectTest@test.com',
      emailVerified: true
    }
  })
})

const sendEmailVerification = jest.fn(() => {
  return Promise.resolve('result of sendEmailVerification')
})

const sendPasswordResetEmail = jest.fn(() => Promise.resolve())

const createUserWithEmailAndPassword = jest.fn(() => {
  return Promise.resolve('result of createUserWithEmailAndPassword')
})

const signInWithEmailAndPassword = jest.fn(() => {
  return Promise.resolve('result of signInWithEmailAndPassword')
})

const signInWithRedirect = jest.fn(() => {
  return Promise.resolve('result of signInWithRedirect')
})

const initializeApp = jest
  .spyOn(firebase, 'initializeApp')
  .mockImplementation(() => {
    return {
      auth: () => {
        return {
          createUserWithEmailAndPassword,
          signInWithEmailAndPassword,
          currentUser: {
            sendEmailVerification
          },
          signInWithRedirect
        }
      }
    }
  })

jest.spyOn(firebase, 'auth').mockImplementation(() => {
  return {
    onAuthStateChanged,
    currentUser: {
      displayName: 'testDisplayName',
      email: 'test@test.com',
      emailVerified: true,
      metadata: {
        creationTime: CREATION_TIME,
        lastSignInTime: LAST_SIGN_IN_TIME}
    },
    getRedirectResult,
    sendPasswordResetEmail
  }
})


test('That new user is shown greeting', () => {
    CREATION_TIME = new Date().getTime();
    LAST_SIGN_IN_TIME = CREATION_TIME;
    USER.uid = 1

    const wrapper = shallow(<App />)
    //We used mocks to pass a user that just logged in for the first time
    expect(wrapper.instance().state.activePanel).toEqual('Greeting');
})

test('That greeting is shown only once', () => {
  CREATION_TIME = new Date().getTime();
  LAST_SIGN_IN_TIME = CREATION_TIME;
  USER.uid = 2

  const wrapper = shallow(<App />)
  //We used mocks to pass a user that just logged in for the first time
  expect(wrapper.instance().state.activePanel).toEqual('Greeting');
  const wrapper2 = shallow(<App />)
  //Pass that user again, even though this is his first login he won't be shown greeting again
  expect(wrapper2.instance().state.activePanel).toEqual('Home');
})

test('That old user is shown home', () => {
  CREATION_TIME = new Date().getTime();
  LAST_SIGN_IN_TIME = CREATION_TIME + 1000; //UTC time
  USER.uid = 3

  const wrapper = shallow(<App />)
  //We used mocks to pass a user that logged in but not for the first time
  expect(wrapper.instance().state.activePanel).toEqual('Home');
})

test('That unauthorised user is shown sing in', () => {
  USER = null

  const wrapper = shallow(<App />)
  expect(wrapper.instance().state.activePanel).toEqual('SignIn');
})

test('Routing works', () => {
  let wrapper = shallow(<App />)
  const panels = ["Loading","Home", "Lesson", "Review", "SignIn", "SignUp", "Greeting", "ResetPassword"]
  
  panels.forEach(panel => {
    wrapper.instance().activePanelHandler(panel)
    expect(wrapper.instance().state.activePanel).toEqual(panel);
  })
})


afterEach(() => {
    jest.clearAllMocks();
});