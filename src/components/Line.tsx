import * as React from "react"
import { stateTypes } from '../reducers/index'
import { getSide } from '../math'
type RootState = typeof stateTypes
type Box = RootState['boxById'][string]
interface AppProps {
    from: Box,
    to: Box,
    id: string,
    lineToggle: boolean
}

export default class Line extends React.Component<AppProps> {
    constructor(props: AppProps, context?: any) {
        super(props, context)
    }
    public render() {
        return (
            <g>
                <path
                    id={this.props.id}
                    d={this.getPath()}
                    fill={'transparent'}
                    strokeWidth="1"
                    stroke="#C1C1C1"
                />
                <text fontFamily="Roboto" fontSize="12" textAnchor="middle" dy="-4px" >
                    <textPath xlinkHref={"#" + this.props.id} startOffset="50%" >
                        description
                    </textPath>
                </text>
            </g>
        )

    }
    private getPath() {
        return this.props.lineToggle ? this.getCurvedPath() : this.getStaightPath()
    }
    private getStaightPath() {
        const { from: from$, to: to$ } = this.props
        const [from, to] = from$.x < to$.x ? [from$, to$] : [to$, from$]
        const p1 = `${from.x + (from.w / 2)}, ${from.y + (from.h / 2)}`
        const p2 = `${to.x + (to.w / 2)}, ${to.y + (to.h / 2)}`
        return `M ${p1} L ${p2}`
    }
    private getCurvedPath() {
        const { from: from$, to: to$ } = this.props
        const [from, to] = from$.x < to$.x ? [from$, to$] : [to$, from$]
        const fm = (box: Box, other: Box) => {
            const side = getSide(
                {
                    nw: { x: box.x, y: box.y },
                    ne: { x: box.x + box.w, y: box.y },
                    sw: { x: box.x, y: box.y + box.h },
                    se: { x: box.x + box.w, y: box.y + box.h }
                },
                {
                    x: box.x + (box.w / 2),
                    y: box.y + (box.h / 2)
                },
                {
                    x: other.x + other.w / 2,
                    y: other.y + other.h / 2
                }
            )
            const ex = side === "e" ? box.w : side === "w" ? 0 : (box.w / 2)
            const ey = side === "s" ? box.h : side === "n" ? 0 : (box.h / 2)
            return { ex, ey, side }
        }
        const f = fm(from, to)
        const t = fm(to, from)
        const n = 2
        const fc = {
            x: f.side === "e"
                ? Math.abs((from.x + f.ex) - (to.x + t.ex))
                : f.side === "w"
                    ? -Math.abs((from.x + f.ex) - (to.x + t.ex))
                    : 0,
            y: f.side === "s"
                ? Math.abs((from.y + f.ey) - (to.y + t.ey))
                : f.side === "n"
                    ? -Math.abs((from.y + f.ey) - (to.y + t.ey))
                    : 0,
        }
        const tc = {
            x: t.side === "e"
                ? Math.abs((from.x + f.ex) - (to.x + t.ex))
                : t.side === "w"
                    ? -Math.abs((from.x + f.ex) - (to.x + t.ex))
                    : 0,
            y: t.side === "s"
                ? Math.abs((from.y + f.ey) - (to.y + t.ey))
                : t.side === "n"
                    ? -Math.abs((from.y + f.ey) - (to.y + t.ey))
                    : 0,
        }
        const p1 = `${from.x + f.ex}, ${from.y + f.ey}`
        const p2 = `${to.x + t.ex}, ${to.y + t.ey}`
        const c1 = `${from.x + f.ex + fc.x / n}, ${from.y + f.ey + fc.y / n}`
        const c2 = `${to.x + t.ex + tc.x / n}, ${to.y + t.ey + tc.y / n}`
        return `M ${p1} C ${c1} ${c2} ${p2}`
    }
}
