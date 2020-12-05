# Prototype Description
There are three possible types of prototypes:
* **R** - Radicals, radicals are basic building blocks of kanji. Radical is a character or a picture that has a name(meaning).
* **K** - Kanji, kanji are chinese characters that could be subdivided into radicals. Kanji are one of the building blocks used in vocabulary. Kanji is a character that has one or more name(meaning) and one or more reading.
* **V** - Vocabulary. Vocabulary is a word of Japanese language that has one or more translation(meaning) and one or more reading.

What fields will be included in a particular prototype depends on the **scope** of the **field** and the **type** of the prototype.

During review cards have 2 sides for R and 3 sides for K and V (this is shown when user wants more information during review session):
* front: **characters, radical_picture, type**
* back#1: **meanings, meaning_mnemonic, components, sentences, extra_data, type**)
* back#2: **readings, reading_mnemonic, components, sentences, extra_data, type**)


### Prototype Data Structure:
| Field | Data type | Scope | Allow null | Description |
| --- | --- | --- | --- | --- |
| id | number | RKV | - | Document ID |
| type | string | RKV | - | R - radical, K - kanji, V - vocabulary |
| is_hidden | boolean | RKV | - | Hidden prototypes will no longer be offered as a lesson for new learners but still will be available for those who already learned it |
| position | number | RKV | - | Position of prototype in it's **Type** in it's level. This allows to fine-tune the user experience |
| level | number | RKV | - | Level on which the prototype appears |
| components | array of references | KV | R | Null for radicals, id of radicals for kanji, id of kanji for vocabulary |
| characters | string | RKV | R |String of unicode characters to represent the prototype, this will be shown to the user as "front of the card" during review.
| radical_picture | string | R | RKV |Picture would be stored in it's base64 form, that field applies only to radicals that don't have appropriate unicode **characters** to represent them |
| meaning_mnemonic | string | RKV | - | Meaning mnemonic/Name mnemonic |
| meanings | array of documents | RKV | - | ***Defined separately below*** |
| reading_mnemonic | string | KV | R | Reading mnemonic |
| readings | array of documents | KV | R |***Defined separately below*** |
| sentences | array of documents | V | RK | ***Defined separately below*** |
| extra_data | string | RKV | RKV | Could contain data like V's part of speech or something else defined in the future |
| url_handle | string | RKV | - |Used to generate URL together with type. Radicals use their meaning, downcased. Kanji and vocabulary use their characters. e.g **k/悲** or **v/悲しい**

#### Meaning Data Structure:
| Field | Data type | Scope | Description |
| --- | --- | --- | --- |
| text | string | RKV | String of unicode characters (mainly cyrillic), names of radicals, names of kanji, translations of words |
| is_primary | boolean | RKV | Exactly one element of an array of meanings must be primary, array is guaranteed to have at least one element |

#### Reading Data Structure:
| Field | Data type | Scope | Description |
| --- | --- | --- | --- |
| kana | string | KV | All readings are stored as hiragana + special characters |
| is_primary | boolean | KV | Exactly one element of an array of meanings must be primary, array is guaranteed to have at least one element |
| is_accepted | boolean | K | We need this field because there are readings that we didn't teach to the user during the kanji lesson that are still readings that exist in the world. We won't accept them during review but we won't mark the review as incorrect either. Instead we will show the user a message saying that we're looking for a different reading |
| is_on | boolean | K | onyomi reading (applicable only to kanji), ***check the note below*** |
| is_kun | boolean | K | kunyomi reading (applicable only to kanji), ***check the note below*** |

***note:*** If both *is_on and is_kun* are false then reading is considered [nanori](https://en.wikipedia.org/wiki/Nanori) this happens only for vocabulary consisting of someone's name, and is given as an option for completeness.

#### Sentence Data Structure:
| Field | Data type | Scope | Description |
| --- | --- | --- | --- |
| text | string | V | String of unicode characters (mainly kanji and kana) |
| translation | string | V | String of unicode characters (mainly cyrillic) |

---
# Item Description
An Item is a representation of a prototype for a certain user.

* Items are created for every prototype when user is created and stored for every user. If new prototypes are added after user creation, then new items are automatically created for every existing user as well.
* At the moment of creation all **..._rev_...** fields are set to 0 and **srs_stage** is set to 0.
* Item is available as a lesson when its **prototype.level <= user.current_level** *AND* **all items with ids of prototype.components[].id have srs_stage >= 5**
* After a successful lesson we change item's **srs_stage from 0 to 1**, set **due_at** to current [unix time](https://en.wikipedia.org/wiki/Unix_time) + [**stages[1].interval**](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/srs-intervals.json) and set **learned_at** to current unix time.
* Item is reviewed when its **due_at <= Current [Unix Time](https://en.wikipedia.org/wiki/Unix_time)** 
* After item's review **srs_stage** is incremented if it was successful. And equals to current_stage - (current_stage >= 5 ? 2 : 1) if failed.
  * After **srs_stage** is updated and is < 9, **due_at** is set to current unix time + [**stages[srs_stage].interval**](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/srs-intervals.json)
  * If **srs_stage** is 9 then **burned_at** is set to current unix time. The item is considered to be remembered and is no longer reviewed.
  * all **..._rev_...** fields are set according to the success/failure of a review.

User could add meaning to the array **aux_meanings** that will be accepted during review as correct. User can also add notes (**reading_note** and **meaning_note**).

### Item Data Structure:
| Field | Type | Allow nulls | Description |
| --- | --- | --- | --- |
| id | number | - | Document ID |
| prototype_id | reference | - | Document ID of item's prototype |
| aux_meanings | array of strings | allow | Meanings added by the user as synonyms | 
| reading_note | string | allow | Reading notes added by the user | 
| meaning_note | string | allow | Meaning notes added by the user | 
| srs_stage | number | - | Current SRS stage number |
| learned_at | timestamp | - | Timestamp of first transition from srs_stage = 0 to srs_stage = 1 |
| burned_at | timestamp | allow | Timestamp of retiring |
| due_at | timestamp | allow |Timestamp of the next available review |
| meaning_rev | number | could be always 0 but still exists | Number of all meaning reviews |
| meaning_rev_correct | number | could be always 0 but still exists | Number of correct meaning reviews |
| meaning_rev_streak | number | could be always 0 but still exists | Number of correct meaning reviews in a row |
| meaning_rev_max_streak | number | could be always 0 but still exists | Max number of correct meaning reviews in a row |
| reading_rev | number | could be always 0 but still exists | Number of all reading reviews |
| reading_rev_correct | number | could be always 0 but still exists | Number of correct reading reviews |
| reading_rev_streak | number | could be always 0 but still exists | Number of correct reading reviews in a row |
| reading_rev_max_streak | number | could be always 0 but still exists | Max number of correct reading reviews in a row |
