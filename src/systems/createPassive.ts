import { passives } from "../data/passives"
import Player from "../entities/Player"

export function createPassive(key: string, player: Player) {

    const data = passives.find(p => p.key === key)
    if (!data) return null

    const passive = {
        key: data.key,
        name: data.name,
        iconKey: data.iconKey,
        level: 1,
        maxLevel: data.maxLevel,
        apply: data.apply
    }

    // apply first level immediately
    passive.apply(player)

    return passive
}