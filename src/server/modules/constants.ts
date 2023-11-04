const ArmorTypes = [
  "Light", "Medium", "Heavy", "Fortified", "Hero", "Unarmored"
] as const;

const AttackTypes = [
  "Normal", "Pierce", "Siege", "Magic", "Chaos", "Hero"
] as const;

const constants = {
  ArmorTypes,
  AttackTypes,
};

export default constants;