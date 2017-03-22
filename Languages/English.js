import Addition from '../Entities/Abilities/Addition';
import Multiplication from '../Entities/Abilities/Multiplication';

const ALPHABET = 'alphabet';
const SYMBOL = 'symbol';
const DIGIT = 'digit';

const INFINITY = 'infinity';
const RIGHT = 'right';
const LEFT = 'left';
const DUAL = 'dual';

const Meanings = [
  {
    id: 'add',
    acceptedWords: ['add'],
    preferredActions: [
      {
        action: Addition,
        targetLookUp: {
          targetType: DIGIT,
          length: INFINITY,
          direction: RIGHT,
          combiners: [' ', 'and', 'with', 'then', 'add']
        }
      }
    ]
  },
  {
    id: 'multiply',
    acceptedWords: ['multiply'],
    preferredActions: [
      {
        action: Multiplication,
        targetLookUp: {
          targetType: DIGIT,
          length: INFINITY,
          direction: RIGHT,
          combiners: [' ', 'and', 'with', 'then', 'multiply']
        }
      }
    ]
  },
  {
    id: 'plus',
    acceptedWords: ['plus', '+'],
    preferredActions: [
      {
        action: Addition,
        targetLookUp: {
          targetType: DIGIT,
          length: 1,
          direction: DUAL,
          combiners: [' ', '+', 'plus']
        }
      }
    ]
  },
  {
    id: 'into',
    acceptedWords: ['into', '*', 'x'],
    preferredActions: [
      {
        action: Multiplication,
        targetLookUp: {
          targetType: DIGIT,
          length: 1,
          direction: DUAL,
          combiners: [' ', 'into', '*', 'x']
        }
      }
    ]
  }
];

const DoAction = function (action, arguements) {
  return action.action.apply(this, arguements);
};

function getPossibleMeaningsByWord(word) {
  const possibleMeanings = [];

  for (let i = 0; i < Meanings.length; i++) {
    if (Meanings[i].acceptedWords.indexOf(word) > -1) {
      possibleMeanings.push(Meanings[i]);
    }
  }

  return possibleMeanings;
}

function getTargets(words, i, targetLookUp) {
  let leftIndex = i;
  let rightIndex = i;
  let leftDone = (targetLookUp.direction === RIGHT);
  let rightDone = (targetLookUp.direction === LEFT);
  const leftWords = [];
  const rightWords = [];

  while (!leftDone || !rightDone) {
    if (!leftDone) {
      if (targetLookUp.combiners.indexOf(words[leftIndex].text) > -1) {
        if (leftIndex > 0) {
          leftIndex = leftIndex - 1;
        } else {
          leftDone = true;
        }
      } else if (words[leftIndex].type === targetLookUp.targetType) {
        leftWords.push(words[leftIndex].text);
        if (leftWords.length === targetLookUp.length) {
          leftDone = true;
        } else if (leftIndex > 0) {
          leftIndex = leftIndex - 1;
        } else {
          leftDone = true;
        }
      } else {
        leftIndex = leftIndex + 1;
        leftDone = true;
      }
    }

    if (!rightDone) {
      if (targetLookUp.combiners.indexOf(words[rightIndex].text) > -1) {
        if (rightIndex < words.length - 1) {
          rightIndex = rightIndex + 1;
        } else {
          rightDone = true;
        }
      } else if (words[rightIndex].type === targetLookUp.targetType) {
        rightWords.push(words[rightIndex].text);
        if (rightWords.length === targetLookUp.length) {
          rightDone = true;
        } else if (rightIndex < words.length - 1) {
          rightIndex = rightIndex + 1;
        } else {
          rightDone = true;
        }
      } else {
        rightIndex = rightIndex - 1;
        rightDone = true;
      }
    }
  }

  return {
    words: leftWords.concat(rightWords),
    startingIndex: leftIndex,
    endingIndex: rightIndex
  };
}

class Word {
  constructor(type, text) {
    this.type = type;
    if (type === DIGIT) {
      this.text = parseInt(text, 10);
    } else {
      this.text = text;
    }
  }
}

const Understand = function (words) {
  for (let i = 0; i < words.length; i++) {
    const possibleMeanings = getPossibleMeaningsByWord(words[i].text);

    if (possibleMeanings.length) {
      const action = possibleMeanings[0].preferredActions[0];
      const targets = getTargets(words, i, action.targetLookUp);

      if (targets.words.length) {
        const result = new Word(DIGIT, DoAction(action.action, targets.words));

        words = words.slice(0, targets.startingIndex).concat([result]).concat(words.slice(targets.endingIndex + 1, words.length));

        return Understand(words);
      }
    }
  }

  let finalWord = '';

  for (let j = 0; j < words.length; j++) {
    finalWord = finalWord + words[j].text;
  }

  return finalWord;
};

const Alphabets = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '\'', '"'];
const Digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const Symbols = [' ', '+', '*', '-', '/', '^'];

function getType(character) {
  if (Alphabets.indexOf(character) > -1) {
    return ALPHABET;
  } else if (Digits.indexOf(character) > -1) {
    return DIGIT;
  } else if (Symbols.indexOf(character) > -1) {
    return SYMBOL;
  }

  return null;
}

const Read = function (text) {
  text = text.toLowerCase();

  const words = [];
  let wordInFormation = '';
  let currentType = null;

  for (let i = 0; i < text.length; i++) {
    const charType = getType(text[i]);

    switch (charType) {
    case ALPHABET:
      currentType = ALPHABET;
      wordInFormation = wordInFormation + text[i];
      break;

    case DIGIT:
      wordInFormation = wordInFormation + text[i];
      if (currentType !== ALPHABET) {
        currentType = DIGIT;
      }
      break;

    case SYMBOL: {
      if (currentType) {
        const word = new Word(currentType, wordInFormation);

        words.push(word);
        wordInFormation = '';
      }
      const symbolWord = new Word(SYMBOL, text[i]);

      words.push(symbolWord);
      currentType = null;
      break;
    }

    default:
      if (currentType) {
        const word = new Word(currentType, wordInFormation);

        words.push(word);
        wordInFormation = '';
      }
      currentType = null;
      break;
    }
  }

  if (currentType) {
    const word = new Word(currentType, wordInFormation);

    words.push(word);
  }

  return words;
};

const Process = function (text) {
  return Understand(Read(text));
};

export default Process;
