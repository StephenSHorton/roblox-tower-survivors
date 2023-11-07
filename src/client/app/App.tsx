import Roact from "@rbxts/roact";

import { Layer } from "./components/Layer";
import { UpgradesMenu } from "./components/UpgradesMenu";

export default function App() {
	return (
		<Layer>
			<UpgradesMenu />
		</Layer>
	);
}
