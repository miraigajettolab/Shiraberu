# SRS Description
### The scheme of the spaced repetition system for shirabe.ru:
---
* **Locked or not yet learned:** Stage 0 means that the item hasn't yet been learned. 

* **Just learned:** Stage 1 means that the item is the stage that item gets just after the user learns it (or fails from some higher stage).

* **Time between stages:** Transition occurs when the item is reviewed. Transition time from stage to stage+1 is expressed in seconds. For example, the time of transition from stage 1 to stage 2 is 14400 seconds or 4 hours. Other transition intervals are approx: 8 hours, 1 day, 2 days, 1 week, 2 weeks, 1 month, 4 months. 

* **Stage 5:** The pass stage (5) is used when one item is necessary for the understanding of other new item. In other words, if item A needs item B then you have to take item B to stage 5 before you can take item A from stage 0 to 1.

* **Calculating the next stage after successful review of an item:**
***next_stage** = current_stage + 1*

* **Calculating the next stage after failed review of an item:**
***next_stage** = current_stage - (ceil(number_of_incorrect_answers/2) * penalty)*
**penalty:** is 2 if the item is passed and 1 if it didn't (current_stage >= 5 ? 2 : 1)
**number_of_incorrect_answers:** means incorrect answers before a correct one, after correct answer is reached that variable is set back to 0. Every item stores that field.

* **Burning an item:** After the transition from 8 to 9 the item is considered to be burned and is no longer reviewed (unless resurrected, which sets stage back to 1). 
---