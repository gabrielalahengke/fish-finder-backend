const {
  AbilityBuilder,
  createMongoAbility,
  Ability,
} = require('@casl/ability');

const policies = {
  user(user, { can }) {
    // membuat titik koordinat
    can('create', 'Coordinate');

    // mendapatkan titik koordinat
    can('read', 'Coordinate', { id: user.id });
  },
};

const policyFor = (user) => {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (user && typeof policies['user'] === 'function') {
    policies['user'](user, { can });
  }

  return build();
};

module.exports = {
  policyFor,
};
