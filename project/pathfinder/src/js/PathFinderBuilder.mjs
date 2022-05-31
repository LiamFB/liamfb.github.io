import Module from "../cpp/ChitonPathCalc.mjs";
import PathFinder from "./PathFinder.mjs";

export default class SetupPathFinder {
    static async build() {
        const module = await Module();
        const pathFinder = new PathFinder(module);
        return pathFinder;
    }
}
