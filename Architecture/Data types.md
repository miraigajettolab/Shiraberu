both tables are incomplere and might even be conflicting
# Prototype Description
*for firestore database*

---
### Prototype Data Structure:
| Field | Type | Description |
| ----- |:----:| -----------:|
| id | number | Document ID |
| type | number | From 1 to 3: 1 - radical, 2 - kanji, 3 - vocabulary |
| hidden | boolean | Hidden prototypes will no longer be offered as a lesson for new learners but still will be available for those who already learned it |
| position | number | Position of prototype in it's level. This allows to finetune the user experience |
| level | number | Level on which the prototype appears |
| meaning_mnemonic | string | Meaning mnemonic |
| meanings | array of strings | Meanings defined by the prototype, first in array is primary |
| reading_mnemonic | string | Reading mnemocic |
| readings | array of strings | Readings defined by the prototype, first in array is primary |
| url_handle | string | Used to generate URL together with type. Radicals use their meaning, downcased. Kanji and vocabulary use their characters. 
---

# Item Description
*for firestore database*

---
### Item Data Structure:
| Field | Type | Description |
| ----- |:----:| -----------:|
| id | number | Document ID |
| prototype_id | reference | Document ID of item's prototype |
| aux_meanings | array of strings | Meanings added by the user as synonyms | 
| reading_note | string | Reading notes added by the user | 
| meaning_note | string | Meaning notes added by the user | 
---