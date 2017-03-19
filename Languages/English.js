import Addition from '../Entities/Abilities/Addition';
import Multiplication from '../Entities/Abilities/Multiplication';

const dictionary = [
  {
    value: 'add',
    action: Addition
  },
  {
    value: 'multiply',
    action: Multiplication
  },
  {
    value: '+',
    action: Addition
  },
  {
    value: '*',
    action: Multiplication
  }
];

const DoAction = function (action, arguements) {
  return action.action.apply(this, arguements);
};

// Right now it just searches for the dictionary value and forms the target list for the action
const Understand = function (text) {
  for (let i = 0; i < dictionary.length; i++) {
    if (text.indexOf(dictionary[i].value) > -1) {
      const words = text.split(' ');

      if (words.indexOf(dictionary[i].value) > -1) {
        const targetList = [];

        for (let j = 0; j < words.length; j++) {
          if (parseInt(words[j], 10)) {
            targetList.push(parseInt(words[j], 10));
          }
        }

        return DoAction(dictionary[i].action, targetList);
      }

      return null;
    }
  }

  return null;
};

export default Understand;
