import Roact from "@rbxts/roact";

import { Counter } from "./components/Counter";
import { Layer } from "./components/Layer";

export default function App() {
	return (
		<Layer>
			<Counter key="counter" />
		</Layer>
	);
}
