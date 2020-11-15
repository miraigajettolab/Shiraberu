# 1. Introduction

This project is a web-based spaced repetion system to fascilitate the process of kanji learning for russian speaking users.

### 1.1 Problem Specific Definitions and Acronyms

 **SRS** - [Spaced Repetition](https://en.wikipedia.org/wiki/Spaced_repetition) System - a set of rules to impliment spaced repetion. Detailed SRS description could be found [here](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/SRS%20description.md)
 **Vocabulary** - Written words in Japanese
 **[Kanji](https://en.wikipedia.org/wiki/Kanji)** - Chinese characters used in Japanese writing system. User needs to know kanji to learn Vocabulary.
 **Kana/Hiragana/Katakana** -  [Syllabaries](https://en.wikipedia.org/wiki/Syllabary) that form parts of the Japanese writing system.
 **[Radicals](https://en.wikipedia.org/wiki/Radical_(Chinese_characters))** - Graphical components of Kanji. User needs to know Radicals to learn Kanji 
 **Mnemonic** - In this case, a story that aids information retention.
 **Prototype** - Definition of Vocabulary, Kanji or Radical using a data structure defined [here](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/Data%20types.md). Prototypes are created by technical writers.
 **Item** - Object reviewed by user using the SRS system. Created for every existing Prototype for every user (If there are 1000 total prototypes and 1000 users then we will store a million objects of this data type). You can think about an item as a projection of a prototype for every user. Data structure defined [here](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/Data%20types.md). Items are created for every prototype, when user is created and. If new prototypes are added after user creation, then new items are automatically created for every existing user as well.
 * Note: from now on (unless specified otherwise) Prototypes and Items could be used interchangeably to mean an object that user learns or reviews.
 **Level** - Items are subdivided into levels to create a more structured experience for user and gamify the learing process. User can learn an Item only after reaching the level of that prototype.
 **Lesson** - One of two main activities that user can engage in. From user's standpoint this is the process of becoming familiar with the item, reading explanations about meanings/translations/reaings/etc. From a data standpoint learning means changing *srs_stage* from 0 to 1, setting *due_at* to current [unix time](https://en.wikipedia.org/wiki/Unix_time) + [stages[1].interval](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/srs-intervals.json) and setting *learned_at* to current unix time.
 **Review** - The other one of two main activities that user can engage in. From user's standpoint this is the process of testing the recall of an item. From a data standpoint it works like this:
* Item is reviewed when its **due_at <= Current [Unix Time](https://en.wikipedia.org/wiki/Unix_time)** 
* After item's review **srs_stage** is incremented if it was successful. And equals to current_stage - (current_stage >= 5 ? 2 : 1) if failed.
  * After **srs_stage** is updated and is < 9, **due_at** is set to current unix time + [**stages[srs_stage].interval**](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/srs-intervals.json)
  * If **srs_stage** is 9 then **burned_at** is set to current unix time. The item is considered to be remembered and is no longer reviewed.
  * all **..._rev_...** fields are set according to the success/failure of a review.

### 1.2 Intended Use

### 1.3 Scope

# 2. Overall Description

### 2.1 User Needs

### 2.2 Assumptions and Dependencies

# 3. System Features and Requirements

### 3.1 Functional Requirements

### 3.2 External Interface Requirements

### 3.3 System Features

### 3.4 Nonfunctional Requirements