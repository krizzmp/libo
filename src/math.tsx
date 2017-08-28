interface Vector {
    x: number
    y: number
}
interface Point {
    x: number
    y: number
}
interface Rect {
    ne: Point
    se: Point
    sw: Point
    nw: Point
}
function getQuad(rect: Rect, p1: Point, p2: Point) {
    const vector = toVector(p1, p2)
    if (vector.x > 0) {
        if (vector.y < 0) {
            return "ne"
        } else {
            return "se"
        }
    } else {
        if (vector.y < 0) {
            return "nw"
        } else {
            return "sw"
        }
    }
}
function toVector(p1: Point, p2: Point): Vector {
    return { x: p2.x - p1.x, y: p2.y - p1.y }
}
function ang(vec: Vector) {
    return Math.atan2(vec.y, vec.x)
}
export function getSide(rect: Rect, p1: Point, p2: Point) {
    const dir = getQuad(rect, p1, p2)
    const cornerAngle = ang(toVector(p1, rect[dir]))
    const arrowAngle = ang(toVector(p1, p2))
    const tf = arrowAngle < cornerAngle
    return {
        ne: tf ? "n" : "e",
        se: tf ? "e" : "s",
        sw: tf ? "s" : "w",
        nw: tf ? "w" : "n"
    }[dir]
}