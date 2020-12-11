import React from 'react';
import { shallow } from 'enzyme';
import EvaluationCard from '../../../panels/evaluation/EvaluationCard'
import songLyrics from './umiyuriSongLyrics'

// Component needs it
let mockCurrent = {
    "characters": "",
}

//This is the reference against which we will test
let hiraganaConcatenated = "";
songLyrics.hiragana.forEach(line => {
    hiraganaConcatenated += line
})

//songLyrics.cyrillic.strictPolivanov - cyrillic version that was obtained using Polivanov System
test('That transcription method works correctly on proper data', () => {
    const wrapper = shallow(
        <EvaluationCard 
            current={mockCurrent} 
            colors={null}
            handleSubmit={null}
        />
    )
    //Input character by character to simulate users typing
    songLyrics.cyrillic.strictPolivanov.forEach(line => {
        for (let i = 0; i < line.length; i++){
            const currentAnswer = wrapper.instance().state.answer
            const event = {
                "target": {
                        "value": currentAnswer + line[i]
                    }
                }
            //Just like a textfield we should fire the .transcribe on every change
            wrapper.instance().transcribe(event)
        }
    })

    console.log("Proper:")
    console.log(wrapper.state())
    //expected to match the reference after transcription
    expect(wrapper.state().answer).toEqual(hiraganaConcatenated);
})

//songLyrics.cyrillic.sloppy - an inconsistent and borderline incorrect(but still parsable) cyrillic version
test('That transcription method works correctly on sloppy data', () => {
    const wrapper = shallow(
        <EvaluationCard 
            current={mockCurrent} 
            colors={null}
            handleSubmit={null}
        />
    )
    //Input character by character to simulate users typing
    songLyrics.cyrillic.sloppy.forEach(line => {
        for (let i = 0; i < line.length; i++){
            const currentAnswer = wrapper.instance().state.answer
            const event = {
                "target": {
                        "value": currentAnswer + line[i]
                    }
                }
            //Just like a textfield we should fire the .transcribe on every change
            wrapper.instance().transcribe(event)
        }
    })

    console.log("Sloppy:")
    console.log(wrapper.state())
    //expected to match the reference after transcription
    expect(wrapper.state().answer).toEqual(hiraganaConcatenated);
})