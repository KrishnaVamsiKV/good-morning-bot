import Ability from '../../EntityDefinitions/Ability';

const AddAction = function () {
  let sum = 0;

  for (let i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }

  return sum;
};

const Addition = new Ability('Addition', 'Add numbers and give result', AddAction);

export default Addition;
