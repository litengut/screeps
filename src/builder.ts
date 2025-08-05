export function runBuilder(creep: Creep) {
  if (creep.memory.m.role !== "builder") return;

  if (creep.memory.m.building && creep.store[RESOURCE_ENERGY] == 0) {
    creep.memory.m.building = false;
    creep.say("🔄 harvest");
  }
  if (!creep.memory.m.building && creep.store.getFreeCapacity() == 0) {
    creep.memory.m.building = true;
    creep.say("🚧 build");
  }

  if (creep.memory.m.building) {
    if (creep.memory.m.ConstructionSiteID) {
      const target = Game.constructionSites[creep.memory.m.ConstructionSiteID];
      if (creep.build(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ff0000" } });
      }
    }

    var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);

    if (!target) return;

    if (creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, { visualizePathStyle: { stroke: "#ff0000" } });
    }
  } else {
    var source = creep.pos.findClosestByPath(FIND_SOURCES);

    if (!source) return;

    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source), { visualizePathStyle: { stroke: "#ffaa00" } };
    }
  }
}
