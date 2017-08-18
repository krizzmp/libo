import * as React from "react"
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { stateTypes, actions } from '../reducers/index'
import { BoxView } from './Box'
import { EditorState } from 'draft-js'
import { Box } from '../reducers'
import * as cuid from 'cuid'
type RootState = typeof stateTypes
const Canvas = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #EEEEEE;
`
const j = <S, R>(fn: (state: S) => R) => ({
    fn,
    rt: {} as R
})
type AppProps = (typeof mapStateToProps.rt) & (typeof mapDispatch.rt)

class App extends React.Component<AppProps> {
    private style: React.CSSProperties = {
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        width: '100%',
        height: '100%'
    }
    constructor(props: AppProps, context?: any) {
        super(props, context)
        this._handleMouseMove = this._handleMouseMove.bind(this)
        this._handleMouseUp = this._handleMouseUp.bind(this)
        this._handleDoubleClick = this._handleDoubleClick.bind(this)
        this._handleDrop = this._handleDrop.bind(this)

        this.renderBoxView = this.renderBoxView.bind(this)
        this._handleTextChange = this._handleTextChange.bind(this)
        this.updateSize = this.updateSize.bind(this)
    }
    public render() {
        return (
            <Canvas
                onDoubleClick={this._handleDoubleClick}
                onMouseMove={this._handleMouseMove}
                onMouseUp={this._handleMouseUp}
            >
                <svg style={this.style}>
                    {this.props.lines.map(this.renderLineView)}
                </svg>
                {this.props.boxes.map(this.renderBoxView)}
            </Canvas>)
    }
    private renderBoxView(box: Box) {
        return (
            <BoxView
                key={box.id}
                editable={box.id === this.props.editedBox}
                x={box.x}
                y={box.y}
                id={box.id}
                selectBox={this.props.selectBox}
                startDrag={this.props.startDragBox}
                dragging={this.props.draggedBox.id === box.id}
                editorState={box.editorState}
                onChange={this._handleTextChange}
                onSize={this.updateSize}
                onDrop={this._handleDrop}
            />
        )
    }
    private renderLineView(line: AppProps['lines'][number]) {
        const f = line.from
        const t = line.to
        return (
            <line
                x1={f.x + (f.w / 2)}
                y1={f.y + f.h / 2}
                x2={t.x + t.w / 2}
                y2={t.y + t.h / 2}
                strokeWidth="1"
                stroke="#C1C1C1"
            />
        )
    }
    private updateSize(id: string, w: number, h: number) {
        this.props.updateSize(id, w, h)
    }
    private _handleTextChange(id: string, editorState: EditorState) {
        this.props.changeText(id, editorState)
    }
    private _handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (this.props.draggedBox.id !== '') {
            const { id, cx, cy, x, y } = this.props.draggedBox
            const dx = cx - x
            const dy = cy - y
            this.props.moveBox(id, e.clientX - dx, e.clientY - dy)
        }
    }
    private _handleMouseUp(e: React.MouseEvent<HTMLDivElement>) {
        this.props.drop('')
    }
    private _handleDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
        this.props.createBox(e.clientX, e.clientY)
    }
    private _handleDrop(droppedId: string) {
        if (this.props.draggedBox.id !== '') {
            this.props.moveBox(this.props.draggedBox.id, this.props.draggedBox.x, this.props.draggedBox.y)
            this.props.createLine(this.props.draggedBox.id, droppedId)
        }
    }
}

const mapStateToProps = j((state: RootState) => ({
    boxes: state.boxList.map((id) => state.boxById[id]),
    lines: state.lineList
        .map((id) => state.lineById[id])
        .map((line) =>
            ({
                ...line,
                from: state.boxById[line.from],
                to: state.boxById[line.to]
            })
        ),
    editedBox: state.selectedBox,
    draggedBox: state.draggedBox,
}))
const mapDispatch = j((dispatch: Dispatch<RootState>) => ({
    createBox(x: number, y: number) {
        dispatch(actions.createBox({ id: cuid(), x, y }))
    },
    selectBox(id: string) {
        dispatch(actions.selectBox({ id }))
    },
    startDragBox(id: string, cx: number, cy: number, x: number, y: number) {
        dispatch(actions.startDragBox({ id, cx, cy, x, y }))
    },
    moveBox(id: string, x: number, y: number) {
        dispatch(actions.moveBox({ id, x, y }))
    },
    changeText(id: string, editorState: EditorState) {
        dispatch(actions.changeText({ id, editorState }))
    },
    drop(droppedId: string) {
        dispatch(actions.drop({}))
    },
    createLine(from: string, to: string) {
        dispatch(actions.createLine({ id: cuid(), from, to }))
    },
    updateSize(id: string, w: number, h: number) {
        dispatch(actions.updateSize({ id, w, h }))
    }
}))
export const Hello = connect(mapStateToProps.fn, mapDispatch.fn)(App)
