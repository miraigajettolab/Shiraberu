# Описание проекта shirabe.ru
## Участники проекта: 
| Имя | Роли | Github | VK | 
| --- | --- | --- |--- | 
| Григоренко Сергей | Руководитель, Разработчик, Архитектор | [miraigajettolab](https://github.com/miraigajettolab) | [donotatme](https://vk.com/donotatme) | 
| Дружинин Владислав  | Работа с документами, Писатель | [TheVaultBoy](https://github.com/TheVaultBoy) | [the_vault_boy](https://vk.com/the_vault_boy) | 
| Магомедов Артур | Написание тестов, Писатель | | [mag.artur](https://vk.com/mag.artur) |

## Определение проблемы:
- Японский - один из самых сложных для изучения языков, особенно учитывая непохожесть его на наш язык. Один из ключевых моментов в изучении языка это изучение слов. Однако, учитывая сложную структуру письменности японского языка для изучения слова нужно сперва изучить знаки (кандзи, 
хирагана, катакана) из которых оно состоит, сами знаки также состоят из более простых элементов.

## Требования: 
* **1)** Разработать систему, которая разбивает процесс изучения большого количества кандзи(иероглифов) и слов на последовательный список простых действий: изучение и повторение, используя систему интервального повторения (Spaced Repetition System) и мнемоники. 
* **2)** Для повторения слов также необходимо разработать систему транслитерации кириллицы в хирагану (в ней возможно записать любую последовательность звуков в японском языке). Этот пункт будет модификацией уже существующей библиотеки транслитерации латиницы в хирагану (транслитерация будет по схеме кириллица -> хирагана, а не кириллица -> латиница -> хирагана)
     * *[С репозиторием можно ознакомиться здесь](https://github.com/miraigajettolab/kikana/tree/dev-cyrillic)*
     * [Попробовать транслитерацию можно тут](https://kikana-dev-test.surge.sh) *(В форму вводится кириллица, хирагана появляется в шапке страницы)*
* **3)** Необходимо заполнить разработанную в 1) систему некоторым количеством реальных слов кандзи и радикалов (кандзи состоят из радикалов).

## Архитектура:

[Неформальную архитектуру можно посмотреть тут](https://github.com/miraigajettolab/Shiraberu/tree/master/Architecture)

[То же самое со спецификациями](https://github.com/miraigajettolab/Shiraberu/blob/master/Specifications/Specs.md)

## Используемые технологии:
* Библиотека транслитерации *[КиКана](https://github.com/miraigajettolab/kikana/tree/dev-cyrillic)* написана на чистом JS и подключена к этому проекту в качестве подмодуля
* Пользовательский фронт разработан на React JS и доступен по адресу: https://shirabe.ru
    * использована библиотека ui компонентов Material-UI
    * адаптивный веб-дизайн
    * юнит тесты написаны с использованием Jest
* Backend реализован на инфраструктуре Google Firebase используя Firestore(nosql database) в качестве БД, Cloud Functions и Firebase Auth
    * юнит тесты для Cloud Functions написаны с использованием Mocha и эмулятора Firebase сервисов
* Для CI используются Github Actions, yaml скрипты: тестов, сборки и деплоя можно посмотреть в [.github/workflows](https://github.com/miraigajettolab/Shiraberu/tree/master/.github/workflows)

## Исходный код:
* [Пользовательский фронт(web приложение)](https://github.com/miraigajettolab/Shiraberu/tree/master/shiraberu-client/src)
* [Библиотека транслитерации](https://github.com/miraigajettolab/kikana/tree/dev-cyrillic/src)
* [Cloud Functions](https://github.com/miraigajettolab/Shiraberu/tree/master/shiraberu-client/functions)

## Unit тесты:
* Для тестирования единственной Firebase Cloud Function - [shiraberu-client/functions/test](https://github.com/miraigajettolab/Shiraberu/tree/master/shiraberu-client/functions/test)
    * [Add User](https://github.com/miraigajettolab/Shiraberu/blob/e5509e0626d1ebace7bc5a2431b1f2d78a39d874/shiraberu-client/functions/test/index.test.js#L33) - тестирует, что на некотором индексе [прототипов](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/Data%20types.md) для нового пользователя корректно создается индекс в котором указаны радикалы/кандзи/слова доступные для изучения и повторения
* Для тестирования фронта и библиотеки транслитерации - [shiraberu-client/test](https://github.com/miraigajettolab/Shiraberu/tree/master/shiraberu-client/test)
    * Для библиотеки транслитерации проверяется соответствие [системе Поливанова](https://github.com/miraigajettolab/Shiraberu/blob/master/shiraberu-client/test/kikana/polivanov.js)
    *   * [That Kikana Supports Polivanov System](https://github.com/miraigajettolab/Shiraberu/blob/master/shiraberu-client/test/kikana/cyrillicToHiragana.test.js)
    * Для модуля Evaluation(ключевой модуль для изучения и повторения радикалов/кандзи/слов) на данных [прототипах](https://github.com/miraigajettolab/Shiraberu/blob/master/Architecture/Data%20types.md) ([на этих](https://github.com/miraigajettolab/Shiraberu/tree/master/ExamplePrototypes))
    *   * [That Evaluation module handles correct inputs](https://github.com/miraigajettolab/Shiraberu/blob/e5509e0626d1ebace7bc5a2431b1f2d78a39d874/shiraberu-client/test/panels/evaluation/Evaluation.test.js#L45)
    *   * [That Evaluation module handles incorrect inputs (that still eventually pass)](https://github.com/miraigajettolab/Shiraberu/blob/e5509e0626d1ebace7bc5a2431b1f2d78a39d874/shiraberu-client/test/panels/evaluation/Evaluation.test.js#L86)
    *   Для непрерывной транскрипции кириллицы в хирагану используя КиКану на [этих данных](https://github.com/miraigajettolab/Shiraberu/blob/master/shiraberu-client/test/panels/evaluation/umiyuriSongLyrics.js)
    *   * [That transcription method works correctly on proper data](https://github.com/miraigajettolab/Shiraberu/blob/e5509e0626d1ebace7bc5a2431b1f2d78a39d874/shiraberu-client/test/panels/evaluation/EvaluationCard.test.js#L18)
    *   * [That transcription method works correctly on sloppy data](https://github.com/miraigajettolab/Shiraberu/blob/e5509e0626d1ebace7bc5a2431b1f2d78a39d874/shiraberu-client/test/panels/evalualoion/EvaluationCard.test.js#L47)
    * Для App.js проверяется, правильный ли компонент показывается пользователю после перехода между компонентами
    *   * [That routing works](https://github.com/miraigajettolab/Shiraberu/blob/master/shiraberu-client/test/App.test.js)

## CI:
* [Test Cloud Functions](https://github.com/miraigajettolab/Shiraberu/blob/master/.github/workflows/firebase-emulators-ci.yaml) - on push/pull request, проводит тесты Cloud Functions
* [Test Frontend Code](https://github.com/miraigajettolab/Shiraberu/blob/master/.github/workflows/frontend-tests-ci.yaml) - on push/pull request, проводит тесты фронта и библиотеки транслитерации
* [Build and Deploy](https://github.com/miraigajettolab/Shiraberu/blob/master/.github/workflows/deploying.yml) - on push/pull request, собирает проект и деплоит его на сервера Firebase (Можно использовать этот скрипт для локальной сборки, убрав последний шаг и заменив команду в предпоследнем на npm start)

---

## Примеры:

### Использования:

<img src="https://github.com/miraigajettolab/Shiraberu/blob/master/Misc/lesson_test.gif" width="282" height="532">

### Непрерывной транслитерации кириллицы в хирагану:
#### акихабара -> あきはばら

<img src="https://github.com/miraigajettolab/Shiraberu/blob/master/Misc/kikana_demo.gif" width="300" height="348">
