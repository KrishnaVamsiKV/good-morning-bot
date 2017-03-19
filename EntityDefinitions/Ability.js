const EmptyAction = function () {
  return null;
};

class Ability {
  constructor(name, description, action) {
    this.name = name;
    this.description = description || name;
    this.action = action || EmptyAction;
  }
}

export default Ability;
