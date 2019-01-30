import {Vector} from "./Vector.js";

export function Point(position, mass) {
    this.p = position; // position
    this.m = mass; // mass
    this.v = new Vector(0, 0); // velocity
    this.a = new Vector(0, 0); // acceleration
}

Point.prototype.applyForce = function (force) {
    this.a = this.a.add(force.divide(this.m));
};
