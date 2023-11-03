import { OnStart } from "@flamework/core";
import { Component, BaseComponent } from "@flamework/components";
import utils from "server/modules/utils";

interface TowerInstance extends Model {
	PrimaryPart: Part;
}

interface Attributes {
	Owner: Player;
	Health: number;
	MaxHealth: number;
	HealthRegen: number;
	Armor: number;
	ArmorType: ArmorType;
}

@Component({
	tag: "Tower",
})
export class Tower extends BaseComponent<Attributes, TowerInstance> implements OnStart {
	onStart() {
		print("Tower component started");
	}

	attack(target: Instance) {
		// TODO target should probably be a component with a damage method
	}

	damage(amount: number, type: AttackType) {
		const armor = this.instance.GetAttribute("Armor") as number | undefined;
		if (!armor) return error("Armor is missing");
		const armorType = this.instance.GetAttribute("ArmorType") as ArmorType | undefined;
		if (!armorType) return error("ArmorType is missing");
		const health = this.instance.GetAttribute("Health") as number | undefined;
		if (!health) return error("Health is missing");

		const totalDamage = utils.calculateDamage(amount, type, armor, armorType);

		const newHealth = health - totalDamage;
		this.onHealthChange(newHealth);
	}

	onHealthChange(newHealth: number) {
		this.instance.SetAttribute("Health", newHealth);
		if (newHealth <= 0) {
			// TODO communicate this, also explode or something
			this.destroy();
		}
	}
}
