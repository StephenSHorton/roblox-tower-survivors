import { OnStart, Service } from "@flamework/core";
import { Players, ServerStorage } from "@rbxts/services";

const projectilePrefab = ServerStorage.WaitForChild("Projectile") as Part;
const cannonPart = game.Workspace.WaitForChild("Cannon") as Part;

@Service({})
export class Test implements OnStart {
	onStart() {
		return;
		Players.PlayerAdded.Connect((player) => {
			const character = player.Character || player.CharacterAdded.Wait()[0];

			const rootPart = character.FindFirstChild("HumanoidRootPart") as Part | undefined;
			if (!rootPart) {
				return error("Could not find HumanoidRootPart");
			}

			// eslint-disable-next-line no-constant-condition
			while (true) {
				const direction = rootPart.Position.sub(cannonPart.Position);
				const duration = math.log(1.001 + direction.Magnitude * 0.01);
				const targetPositionWithVelocity = rootPart.Position.add(rootPart.AssemblyLinearVelocity.mul(duration));
				const resultDirection = targetPositionWithVelocity.sub(cannonPart.Position);
				const force = resultDirection
					.div(duration)
					.add(new Vector3(0, game.Workspace.Gravity * duration * 0.5, 0));

				const projectile = projectilePrefab.Clone();
				projectile.PivotTo(cannonPart.CFrame);
				projectile.Parent = game.Workspace;
				projectile.ApplyImpulse(force.mul(projectile.Mass));
				projectile.SetNetworkOwner(undefined); // Stops the part from being claimed by the client in and out

				task.wait(2);
			}
		});
	}
}
