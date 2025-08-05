export function runUpgrader(creep: Creep) {
  if (creep.memory.m.role !== "upgrader") return;

  if (creep.memory.m.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.m.upgrading = false;
    creep.say("🔄 harvest");
  }
  if (!creep.memory.m.upgrading && creep.store.getFreeCapacity() == 0) {
    creep.memory.m.upgrading = true;
    creep.say("⚡ upgrade");
  }

  if (creep.memory.m.upgrading) {
    if (creep.upgradeController(creep.room.controller!) == ERR_NOT_IN_RANGE) {
      creep.moveTo(creep.room.controller!, { visualizePathStyle: { stroke: "#ffffff" } });
    }
  } else {
    var source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (!source) return;
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
    }
  }
}
