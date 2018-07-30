import { Vector2 } from "../vector2";
import { Creature } from "./creature";

export class StaticTools {
    public static nearestCreatureToPosition(creatures: Creature[], position: Vector2): Creature {
        if (creatures.length === 0) {
            throw new Error("Nearest creature is undefined for zero creatures");
        }
        return creatures.reduce((previous, current) => {
            const currentDistance = position.vectorTo(current.position).length;
            if (previous.distance > currentDistance) {
                return {
                    distance: currentDistance,
                    nearest: current,
                };
            }
            return previous;
        }, {
            distance: position.vectorTo(creatures[0].position).length,
            nearest: creatures[0],
        }).nearest;
    }
}
