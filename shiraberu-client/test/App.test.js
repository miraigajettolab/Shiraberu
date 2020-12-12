import React from 'react';
import App from '../src/App'
import * as firebase from 'firebase'
import { shallow } from 'enzyme';

const onAuthStateChanged = jest.fn(() => {
  return Promise.resolve('result of sendEmailVerification')
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
      emailVerified: true
    },
    getRedirectResult,
    sendPasswordResetEmail
  }
})

  jest.spyOn(firebase, 'auth').mockImplementation(() => {
    return {
      onAuthStateChanged,
      currentUser: {
        displayName: 'testDisplayName',
        email: 'test@test.com',
        emailVerified: true
      }
    }
  })
  

test('Test test', () => {
    const wrapper = shallow(<App />)
    expect(wrapper.state().activePanel).toEqual('Loading');
    console.log(wrapper.state())
})

afterEach(() => {
    jest.clearAllMocks();
});