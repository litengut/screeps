import { runBuilder } from "builder";
import { runHarvester } from "harvester";
import { runUpgrader } from "upgrader";
import { ErrorMapper } from "utils/ErrorMapper";

declare global {
  /*
    Example types, expand on these or remove them and add your own.
    Note: Values, properties defined here do no fully *exist* by this type definiton alone.
          You must also give them an implemention if you would like to use them. (ex. actually setting a `role` property in a Creeps memory)

    Types added in this `global` block are in an ambient, global context. This is needed because `main.ts` is a module file (uses import or export).
    Interfaces matching on name from @types/screeps will be merged. This is how you can extend the 'built-in' interfaces from @types/screeps.
  */
  // Memory extension samples
  interface Memory {
    uuid: number;
    log: any;
  }

  interface CreepMemory {
    m: creepMemory;
  }
  // Syntax for adding properties to `global` (ex "global.log")
  namespace NodeJS {
    interface Global {
      log: any;
    }
  }
}

type creepMemory = HarvesterMemory | UpgraderMemory | BuilderMemory;

type HarvesterMemory = {
  role: "harvester";
};

type UpgraderMemory = {
  role: "upgrader";
  upgrading: boolean;
};

type BuilderMemory = {
  role: "builder";
  building: boolean;
  ConstructionSiteID?: string;
};

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  const harvesters = _.filter(Game.creeps, creep => creep.memory.m.role === "harvester");
  console.log(`Harvesters: ${harvesters.length}`);
  if (harvesters.length < 5) {
    const newName = "Harvester" + Game.time;

    const creep = Game.spawns["Spawn1"].spawnCreep([WORK, WORK, CARRY, MOVE], newName, {
      memory: { m: { role: "harvester" } }
    });

    console.log(`Spawning new harvester: ${newName}`);
  }

  const upgraders = _.filter(Game.creeps, creep => creep.memory.m.role === "upgrader");

  console.log(`Upgraders: ${upgraders.length}`);
  if (upgraders.length < 4) {
    const newName = "Upgrader" + Game.time;

    const creep = Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, CARRY, MOVE], newName, {
      memory: { m: { role: "upgrader", upgrading: false } }
    });

    console.log(`Spawning new upgrader: ${newName}`);
  }

  const builders = _.filter(Game.creeps, creep => creep.memory.m.role === "builder");

  console.log(`Builders: ${builders.length}`);
  if (builders.length < 8) {
    const newName = "Builder" + Game.time;
    Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, CARRY, MOVE], newName, {
      memory: { m: { role: "builder", building: false } }
    });
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.m.role === "harvester") {
      runHarvester(creep);
    } else if (creep.memory.m.role === "upgrader") {
      runUpgrader(creep);
    } else if (creep.memory.m.role === "builder") {
      runBuilder(creep); // Placeholder for builder logic
    }
  }

  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    const creep = Game.creeps[name];
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
});
