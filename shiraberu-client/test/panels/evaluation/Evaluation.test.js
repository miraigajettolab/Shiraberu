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

    function  onPass(obj) {
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