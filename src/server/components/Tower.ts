import { OnStart } from "@flamework/core";
import { Component } from "@flamework/components";
import { Mortal, MortalAtrributes, MortalInstance } from "./base/Mortal";
import constants from "server/modules/constants";

interface TowerInstance extends MortalInstance {}

interface Attributes extends MortalAtrributes {}

@Component({
	tag: "Tower",
})
export class Tower extends Mortal<Attributes, TowerInstance> implements OnStart {
	onStart() {
		// this.maid.GiveTask(this.instance.AttributeChanged.Connect((attribute) => {
		// 	if (attribute === "Health") {
		// 		print("Tower health changed " + this.attributes.Health);
		// 	}
		// }))
	}
}