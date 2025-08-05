export function runHarvester(creep: Creep) {
  if (creep.store.getFreeCapacity() > 0) {
    const source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (source) {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
        creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
      }
    }
  } else {
    const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType === STRUCTURE_SPAWN;
      },
    });
    creep.say(`🔄 transfer ${target}`);
    if (target) {


      if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: "#ffffff" } });
      }
    }
  }
}
