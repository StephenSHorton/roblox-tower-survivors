import { Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import { PhysicsService, Players, ServerStorage } from "@rbxts/services";
import { Tower } from "server/components/Tower";

import { WaveService } from "./WaveService";

const WAVE_INTERVAL = 10;

const towerPrefab = ServerStorage.WaitForChild("Tower");

@Service({})
export class Game implements OnStart {
	private gameIsRunning = false;
	private players = new Map<Player["UserId"], Tower>();

	constructor(private WaveService: WaveService) {}

	onStart() {
		// Register collision group for players
		PhysicsService.RegisterCollisionGroup("Player");
		PhysicsService.CollisionGroupSetCollidable("Player", "Enemy", false);

		this.waitForPlayers();

		this.gameIsRunning = true;

		const towers: Tower[] = [];
		this.players.forEach((tower) => {
			towers.push(tower);
		});

		while (this.gameIsRunning) {
			this.WaveService.SpawnWave(0, towers);
			wait(WAVE_INTERVAL);
		}
	}

	private waitForPlayers(count = 1) {
		Players.PlayerAdded.Connect((player) => {
			print("Player added: " + player.Name);
			this.changePlayerCollisions(player);
			this.addPlayer(player);
		});

		if (Players.GetPlayers().size() < count) {
			print("Waiting for more players... " + count);
			wait(2);
			this.waitForPlayers(count);
		}
	}

	private addPlayer(player: Player) {
		const components = Dependency<Components>();
		const towerInstance = towerPrefab.Clone();
		const tower = components.getComponent<Tower>(towerInstance) || components.addComponent<Tower>(towerInstance);
		tower.instance.Parent = game.Workspace;
		this.players.set(player.UserId, tower);
	}

	private changePlayerCollisions(player: Player) {
		player.CharacterAdded.Connect((character) => {
			for (const part of character.GetDescendants()) {
				if (part.IsA("BasePart")) {
					part.CollisionGroup = "Player";
				}
			}
			character.DescendantAdded.Connect((part) => {
				if (part.IsA("BasePart")) {
					part.CollisionGroup = "Player";
				}
			});
		});
	}
}
