import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

import { Mortal, MortalAtrributes, MortalInstance } from "./base/Mortal";

interface TowerInstance extends MortalInstance {}

interface Attributes extends MortalAtrributes {}

@Component({
	tag: "Tower",
})
export class Tower extends Mortal<Attributes, TowerInstance> implements OnStart {
	onStart() {}
}
