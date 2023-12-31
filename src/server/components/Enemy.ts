import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

import { Mortal, MortalAtrributes, MortalInstance } from "./base/Mortal";
import { Tower } from "./Tower";

interface EnemyInstance extends MortalInstance {}

interface Attributes extends MortalAtrributes {
	Speed: number;
}
// TODO - set network owner to nil for all parts
@Component({
	tag: "Enemy",
})
export class Enemy extends Mortal<Attributes, EnemyInstance> implements OnStart {
	onStart(): void {
		this.setNetworkOwnerToNil();
	}

	/**
	 * SetTargetTower is used to make the enemy chase the target tower
	 * @param target The target tower to pursue
	 */
	public SetTargetTower(targetTower: Tower) {
		const targetAttachment = targetTower.instance.PrimaryPart.Attachment;
		const selfAttachment = this.instance.PrimaryPart.Attachment;

		const alignPosition =
			selfAttachment.Parent?.FindFirstChildOfClass("AlignPosition") || new Instance("AlignPosition");
		alignPosition.Parent = selfAttachment.Parent;
		alignPosition.MaxVelocity = this.attributes.Speed;
		alignPosition.MaxForce = math.huge;
		alignPosition.Attachment0 = selfAttachment;
		alignPosition.Attachment1 = targetAttachment;
	}

	private setNetworkOwnerToNil(): void {
		const parts = this.instance.GetDescendants();
		for (const part of parts) {
			if (part.IsA("BasePart")) {
				part.SetNetworkOwner(undefined);
			}
		}
	}
}
