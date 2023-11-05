import { BaseComponent, Component } from "@flamework/components";
import { RunService } from "@rbxts/services";
import constants from "server/modules/constants";
import utils from "server/modules/utils";
export interface MortalInstance extends Model {
	PrimaryPart: MortalInstance["RootPart"];
	RootPart: Part & {
		Attachment: Attachment;
		WeldConstraint: WeldConstraint;
	};
	HealthGui: BillboardGui & {
		Bar: Frame & {
			Progress: Frame;
			HealthCount: TextLabel;
		};
	};
}

export interface MortalAtrributes {
	Owner: BrickColor;
	Health: number;
	MaxHealth: number;
	HealthRegen: number;
	Armor: number;
	ArmorType: (typeof constants.ArmorTypes)[number];
}

@Component()
export class Mortal<A extends MortalAtrributes, I extends MortalInstance> extends BaseComponent<A, I> {
	constructor() {
		super();

		this.initHealthGui();
	}

	public TakeDamage(amount: number, attackType: (typeof constants.AttackTypes)[number]) {
		const armor = this.attributes.Armor;
		const armorType = this.attributes.ArmorType;
		const health = this.attributes.Health;

		const totalDamage = utils.calculateDamage(amount, attackType, armor, armorType);

		const newHealth = math.max(health - totalDamage, 0);
		this.onHealthChange(newHealth);
	}

	private onHealthChange(newHealth: number) {
		this.attributes.Health = newHealth;
		const healthGui = this.instance.HealthGui;
		const healthBar = healthGui.Bar;
		const healthBarProgress = healthBar.Progress;
		const maxHealth = this.attributes.MaxHealth;
		healthBarProgress.Size = new UDim2(newHealth / maxHealth, 0, 1, 0);

		const healthCount = healthBar.HealthCount;
		healthCount.Text = tostring(newHealth);

		if (newHealth <= 0) {
			// TODO communicate this, also explode or something
			this.destroy();
		}
	}

	private initHealthGui() {
		const startingHealth = this.attributes.Health;
		const healthCount = this.instance.HealthGui.Bar.HealthCount;
		healthCount.Text = tostring(startingHealth);

		let lastTick = tick();

		this.maid.GiveTask(
			RunService.Heartbeat.Connect(() => {
				const currentTime = tick();
				const healthRegenRate = this.attributes.HealthRegen; // How many times health regenerates per second
				const healthRegenInterval = 1 / healthRegenRate; // Calculate the interval based on the rate

				if (currentTime - lastTick < healthRegenInterval) return;
				lastTick = currentTime;

				// TODO: Check if the character is dead and skip regeneration if so
				// if (this.isDead()) return;

				// TODO: Implement logic for effects that might disable or reduce health regen
				// if (this.isHealthRegenDisabled()) return;

				const health = this.attributes.Health;
				const maxHealth = this.attributes.MaxHealth;

				// Only regenerate health if the character is not dead
				if (health > 0) {
					const newHealth = math.min(health + 1, maxHealth); // Increment health by 1
					this.onHealthChange(newHealth);
				}
			}),
		);
	}
}
