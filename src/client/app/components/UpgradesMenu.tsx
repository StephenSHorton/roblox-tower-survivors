import Roact from "@rbxts/roact";

import { useRem } from "../hooks/use-rem";
import { fonts } from "../utils/fonts";
import { palette } from "../utils/palette";
import Button from "./Button";

export function UpgradesMenu() {
	const rem = useRem();

	return (
		<frame
			Size={new UDim2(0, 200, 0, 100)}
			AnchorPoint={new Vector2(1, 1)}
			Position={new UDim2(1, 0, 1, 0)}
			BackgroundColor3={palette.white}
			BackgroundTransparency={0.8}
		>
			<Button
				font={fonts.inter.medium}
				text="1️⃣"
				textSize={rem(2)}
				textColor={palette.white}
				backgroundColor={palette.white}
				size={new UDim2(0, rem(5), 0, rem(5))}
				position={new UDim2(1, 0, 1, 0)}
				anchorPoint={new Vector2(1, 1)}
			/>
		</frame>
	);
}
