import Ability from '../../EntityDefinitions/Ability';

const MultiplyAction = function () {
  let product = 1;

  for (let i = 0; i < arguments.length; i++) {
    product *= arguments[i];
  }

  return product;
};

const Multiplication = new Ability('Multiplication', 'Multiply numbers and give result', MultiplyAction);

export default Multiplication;
