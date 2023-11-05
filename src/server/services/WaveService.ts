import { Components } from "@flamework/components";
import { Dependency, Service } from "@flamework/core";
import { ServerStorage } from "@rbxts/services";
import { Enemy } from "server/components/Enemy";
import { Tower } from "server/components/Tower";

const enemiesFolder = ServerStorage.WaitForChild("Enemies");
const level1Folder = enemiesFolder.WaitForChild("Level1");

const prefabs = {
	box: level1Folder.WaitForChild("TNT"),
} as const;

const waveInfo = [
	{
		kind: prefabs.box,
		maxSpawns: 10,
		spawnInterval: 1,
	},
] as const;

@Service({})
export class WaveService {
	private wave = 0;

	public GetWaveInfo() {
		return waveInfo[this.wave];
	}

	public SpawnWave(wave: number, towers: Tower[]) {
		if (!waveInfo[wave]) {
			warn("Index out of range wave number, got: " + wave);
			return;
		}

		for (const tower of towers) {
			spawn(() => {
				for (let i = 0; i < waveInfo[wave].maxSpawns; i++) {
					wait(waveInfo[wave].spawnInterval);
					this.spawnEnemy(waveInfo[wave].kind, tower);
				}
			});
		}
	}

	private spawnEnemy(kind: Instance, tower: Tower) {
		const components = Dependency<Components>();
		const enemy = components.getComponent<Enemy>(kind.Clone()) || components.addComponent<Enemy>(kind.Clone());

		// Choose a random location around the tower
		const location = this.getRandomCFrameAroundPlayer(tower);
		enemy.instance.PivotTo(location);
		enemy.instance.Parent = game.Workspace;

		enemy.SetTargetTower(tower);
	}

	private getRandomCFrameAroundPlayer(tower: Tower) {
		const randomAngle = math.random(0, 360);
		const distance = 20;
		const randomPosition = new Vector3(
			tower.instance.RootPart.Position.X + distance * math.cos(randomAngle),
			tower.instance.RootPart.Position.Y,
			tower.instance.RootPart.Position.Z + distance * math.sin(randomAngle),
		);
		const cFrame = new CFrame(randomPosition, tower.instance.RootPart.Position);

		return cFrame;
	}
}
