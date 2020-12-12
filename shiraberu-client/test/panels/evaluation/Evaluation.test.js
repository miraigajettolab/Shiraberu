import React from 'react';
import { shallow } from 'enzyme';
import Evaluation from '../../../src/panels/evaluation/Evaluation'
//Let's import first level and a part of second
import R1L from '../../../../ExamplePrototypes/R1L'
import K1L from '../../../../ExamplePrototypes/K1L'
import V1L from '../../../../ExamplePrototypes/V1L'
import R2L from '../../../../ExamplePrototypes/R2L'
import 'regenerator-runtime/runtime'

function checkIsReading(current){
    if(!current.readingPassed && !current.meaningPassed){
        return (current.meaningFirst ? false: true)
    }
    else{
        return (current.readingPassed ? false: true)
    }
}

//Let's assemble our prototypes into a single array
let prototypes = []
prototypes = prototypes.concat(R1L.data)
prototypes = prototypes.concat(K1L.data)
prototypes = prototypes.concat(V1L.data)
prototypes = prototypes.concat(R2L.data)

//Lets map prototypes to include easy to refer to correctReading and correctMeaning
//Evaluation will ignore extra fields
//We just need it to simplify our tests
prototypes = prototypes.map(prot => {
    let testProt = prot
    testProt.correctMeaning = prot.meanings[0].text
    if(prot.type === "K") {
        let temp = prot.readings.filter(rd => rd.is_accepted === true)
        temp = temp.map(rd => rd.kana)
        testProt.correctReading = temp[0]
    }
    else if (prot.type === "V") {
        let temp = prot.readings.map(rd => rd.kana)
        testProt.correctReading = temp[0]
    }
    return testProt
})

test('That Evaluation module handles correct inputs', async function (){
    let listOfPassedItems = []

    function onPass(obj, remaining) {
        return new Promise(function(resolve, reject) {
            if (!obj.didFail){
                listOfPassedItems.push(obj.id)
            }
            resolve();
        });
    }

    const wrapper = shallow(
        <Evaluation 
            theme = {null} 
            colors={null}
            prototypes = {prototypes}
            onPass = {onPass}
        />
    )

    while(wrapper.instance().state.prototypes[0]){
        const isReading =  checkIsReading(wrapper.instance().state.prototypes[0])
        const currentId =  wrapper.instance().state.prototypes[0].id
        let answer = ""
        if(isReading) {
            answer = prototypes.find(x => x.id === currentId).correctReading
        }
        else {
            answer = prototypes.find(x => x.id === currentId).correctMeaning
        }
        await wrapper.instance().handleSubmit(answer, isReading, true).catch(e => null)
    }

    console.log(listOfPassedItems.length)
    //For each prot expect that it passed
    prototypes.forEach(prot => {
        expect(listOfPassedItems).toContain(prot.id)
    })
})

test('That Evaluation module handles incorrect inputs (that still eventually pass)', async function (){
    let listOfPassedItems = []
    let listOfFailedItems = []

    function  onPass(obj, remaining) {
        return new Promise(function(resolve, reject) {
            if (!obj.didFail){
                listOfPassedItems.push(obj.id)
            }
            else{
                listOfFailedItems.push(obj.id)
            }
            resolve();
        });
    }

    const wrapper = shallow(
        <Evaluation 
            theme = {null} 
            colors={null}
            prototypes = {prototypes}
            onPass = {onPass}
        />
    )

    let listToFail = [];
    const failureRate = Math.random() // random failure probability //TODO: try normal distribution
    //We will fail an item 
    prototypes.forEach(prot => {
        if (Math.random() < failureRate){ //Happens with probability of FailureRate, since Math.random() has uniform distribution
            listToFail.push({
                "id" : prot.id,
                "remainingFails": parseInt(Math.random()*10)+1 //random number between 1 and 10 //TODO: try normal distribution
            })
        } 
    })

    while(wrapper.instance().state.prototypes[0]){
        const isReading =  checkIsReading(wrapper.instance().state.prototypes[0])
        const currentId =  wrapper.instance().state.prototypes[0].id
        const indexInFailList = listToFail.findIndex(x => x.id === currentId);
        let answer = ""

        if(isReading) {
            answer = prototypes.find(x => x.id === currentId).correctReading
        }
        else {
            answer = prototypes.find(x => x.id === currentId).correctMeaning
        }

        if(indexInFailList !== -1 && listToFail[indexInFailList].remainingFails > 0){
            //If we want to fail an item we need to garble the correct answer
            //Appending reversed correct answer to correct answer will produce an incorrect answer 
            answer += answer.split("").reverse().join("");
            //But just in case let's take answer appended with a randomly shuffled version of itself
            answer += answer.split("").sort(function(){return 0.5-Math.random()}).join('');
            //Example of meaning garbling Person => PersonnosrePsPorenrnoseP
            //Example of reading garbling みっつ => みっつつっみっみみつっつ

            //We need to decrement the remainingFails of this item
            let failItem = listToFail[indexInFailList];
            failItem.remainingFails -= 1
            listToFail[indexInFailList] = failItem
        }

        await wrapper.instance().handleSubmit(answer, isReading, true).catch(e => null)
    }

    //For each prot expect that
    prototypes.forEach(prot => {
        //It either passed or failed
        expect(listOfPassedItems.concat(listOfFailedItems)).toContain(prot.id)
    })
    listToFail.forEach(failItem => {
        //All items mentioned in listToFail should be in listOfFailedItems
        expect(listOfFailedItems).toContain(failItem.id)
        //All items mentioned in listToFail shouldn't be in listOfPassedItems
        expect(listOfPassedItems).not.toContain(failItem.id)
    })
})