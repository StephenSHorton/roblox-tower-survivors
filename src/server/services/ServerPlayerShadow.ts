import { Service, OnStart } from "@flamework/core";
import { Players, RunService } from "@rbxts/services";

@Service({})
export class ServerPlayerShadow implements OnStart {
	onStart() {
		Players.PlayerAdded.Connect((player) => {
			const character = player.Character || player.CharacterAdded.Wait()[0];
			const rootPart = character.FindFirstChild("HumanoidRootPart") as Part | undefined;
			if (!rootPart) {
				return error("Could not find HumanoidRootPart");
			}

			const floatingPart = new Instance("Part");
			floatingPart.Anchored = true;
			floatingPart.CanCollide = false;
			floatingPart.Size = character.GetBoundingBox()[1];
			floatingPart.PivotTo(rootPart.CFrame);
			floatingPart.Parent = game.Workspace;
			floatingPart.TopSurface = Enum.SurfaceType.Smooth;
			floatingPart.BottomSurface = Enum.SurfaceType.Smooth;

			floatingPart.Material = Enum.Material.ForceField;
			floatingPart.BrickColor = new BrickColor("Bright red");

			RunService.Heartbeat.Connect(() => {
				floatingPart.PivotTo(rootPart.CFrame);
			});
		});
	}
}
