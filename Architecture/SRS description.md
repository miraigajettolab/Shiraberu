# SRS Description
### The scheme of the spaced repetition system for shirabe.ru:
**Note:** *item* is created from *prototype*. Item contains only metadata prototype_id or current_stage/etc. Actual translations/readings/example sentences/etc are stored in prototype of an item.

---
* **Locked or not yet learned:** Stage 0 means that the item hasn't yet been learned (and created from prototype). 

* **Just learned:** Stage 1 means that the item is the stage that item gets just after the user learns it (or fails from some higher stage).

* **Time between stages:** Transition occurs when the item is reviewed. Transition time from stage to stage+1 is expressed in seconds. For example, the time of transition from stage 1 to stage 2 is 14400 seconds or 4 hours. Other transition intervals are approx: 8 hours, 1 day, 2 days, 1 week, 2 weeks, 1 month, 4 months. 

* **Stage 5:** The pass stage (5) is used when one item is necessary for the creation of other new item (like learning radicals before kanji and kanji before vocabulary). In other words, if item A needs item B then you have to take item B to stage 5 before you can take item A from stage 0 to 1.

* **What is considered to be a successful review in an item where multiple parts are independently reviewed:**
For example, the vocabulary item requires separate input of translation and reading):
*If all parts of the review are individually correct then the review is **successful**, if one or more part is incorrect then the whole review is considered **failed***

* **Calculating the next stage after successful review of an item:**
***next_stage** = current_stage + 1*

* **Calculating the next stage after failed review of an item:**
***next_stage** = current_stage - * penalty*
  * **penalty:** is 2 if the item is passed and 1 if it didn't (current_stage >= 5 ? 2 : 1)

* **Burning an item:** After the transition from 8 to 9 the item is considered to be burned and is no longer reviewed (unless resurrected, which sets stage back to 1). 
---
