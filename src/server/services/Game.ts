import { Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import Object from "@rbxts/object-utils";
import { PhysicsService, Players, RunService, ServerStorage } from "@rbxts/services";
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
		// Removed 'return;' to allow the following initialization code to run
		PhysicsService.RegisterCollisionGroup("Player");
		PhysicsService.CollisionGroupSetCollidable("Player", "Enemy", false);

		this.waitForPlayers();
		this.startGameLoop();
	}

	private waitForPlayers(count = 1) {
		// Changed to an event-based waiting mechanism
		const playerAddedConnection = Players.PlayerAdded.Connect((player) => {
			if (Players.GetPlayers().size() >= count) {
				playerAddedConnection.Disconnect(); // Disconnect the event once we have enough players
				this.startGameLoop();
			}
			this.changePlayerCollisions(player);
			this.addPlayer(player);
		});
	}

	private startGameLoop() {
		this.gameIsRunning = true;
		RunService.Heartbeat.Connect(() => {
			while (this.gameIsRunning) {
				wait(WAVE_INTERVAL); // Yield the loop to wait for the next wave
				const towers: Tower[] = [...Object.values(this.players)];
				this.WaveService.SpawnWave(0, towers);
			}
		});
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
