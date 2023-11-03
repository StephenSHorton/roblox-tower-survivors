const damageMatrix = {
	Normal: { Light: 1, Medium: 1.5, Heavy: 1, Fortified: 0.7, Hero: 1, Unarmored: 1 },
	Pierce: { Light: 2, Medium: 0.75, Heavy: 1, Fortified: 0.35, Hero: 0.5, Unarmored: 1.5 },
	Siege: { Light: 1, Medium: 0.5, Heavy: 1, Fortified: 1.5, Hero: 0.5, Unarmored: 1.5 },
	Magic: { Light: 1.25, Medium: 0.75, Heavy: 2, Fortified: 0.35, Hero: 0.5, Unarmored: 1 },
	Chaos: { Light: 1, Medium: 1, Heavy: 1, Fortified: 1, Hero: 1, Unarmored: 1 },
	Hero: { Light: 1, Medium: 1, Heavy: 1, Fortified: 0.5, Hero: 1, Unarmored: 1 },
} as const;

const utils = {
	calculateDamage(attackAmount: number, attackType: AttackType, armorAmount: number, armorType: ArmorType): number {
		const damageMultiplier = damageMatrix[attackType][armorType];
		const armorMultiplier =
			armorAmount > 0 ? 1 - (armorAmount * 0.06) / (1 + 0.06 * armorAmount) : 2 - math.pow(0.94, -armorAmount);
		return attackAmount * damageMultiplier * armorMultiplier;
	},
};

export default utils;
