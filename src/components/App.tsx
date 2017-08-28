import * as React from "react"
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch, bindActionCreators } from 'redux'
import { stateTypes, actions } from '../reducers/index'
import BoxView from './Box'
import LineView from './Line'
import * as cuid from 'cuid'
import AppBar from './AppBar'
type RootState = typeof stateTypes
const Canvas = styled.div`
    position: absolute;
    top: 64px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: #EEEEEE;
`
const SVG = styled.svg`
    position: fixed;
    top: 0;
    left: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
`
const j = <S, R>(fn: (state: S) => R) => ({ fn, rt: {} as R })
const g = <S, R>(fn: (dispatch: Dispatch<S>) => R) => ({ fn, rt: {} as R })
type AppProps = (typeof mapStateToProps.rt) & (typeof mapDispatch.rt)

class App extends React.Component<AppProps> {
    constructor(props: AppProps, context?: any) {
        super(props, context)
        this._handleMouseMove = this._handleMouseMove.bind(this)
        this._handleMouseUp = this._handleMouseUp.bind(this)
        this._handleDoubleClick = this._handleDoubleClick.bind(this)
        this.onDrop = this.onDrop.bind(this)

        this.renderBoxView = this.renderBoxView.bind(this)
        this.renderLineView = this.renderLineView.bind(this)
    }
    public render() {
        return (
            <div>
                <AppBar title="Hatch.io" onToggle={this.props.toggleLineType} lineToggle={this.props.lineType} />
                <Canvas
                    onDoubleClick={this._handleDoubleClick}
                    onMouseMove={this._handleMouseMove}
                    onMouseUp={this._handleMouseUp}
                >
                    <SVG >
                        {this.props.lines.map(this.renderLineView)}
                    </SVG>
                    {this.props.boxes.map(this.renderBoxView)}
                </Canvas>
            </div>
        )
    }
    private renderBoxView(box: AppProps['boxes'][number]) {
        return (
            <BoxView
                key={box.id}
                x={box.x}
                y={box.y}
                editable={box.id === this.props.editedBox}
                dragging={this.props.draggedBox.id === box.id}
                id={box.id}
                editBox={this.props.editBox}
                startDrag={this.props.startDragBox}
                editorState={box.editorState}
                onChange={this.props.changeText}
                onDrop={this.onDrop}
                onSize={this.props.updateSize}
            />
        )
    }

    private renderLineView(line: AppProps['lines'][number]) {
        return (
            <LineView
                key={line.id}
                from={line.from}
                to={line.to}
                id={line.id}
                lineToggle={this.props.lineType}
            />
        )
    }
    private onDrop({ droppedId }: { droppedId: string }) {
        if (this.props.draggedBox.id !== '') {
            this.props.moveBox({ id: this.props.draggedBox.id, x: this.props.draggedBox.x, y: this.props.draggedBox.y })
            this.props.createLine({ id: cuid(), from: this.props.draggedBox.id, to: droppedId })
        }
    }
    private _handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (this.props.draggedBox.id !== '') {
            const { id, cx, cy, x, y } = this.props.draggedBox
            const dx = cx - x
            const dy = cy - y
            this.props.moveBox({ id, x: e.clientX - dx, y: e.clientY - dy })
        }
    }
    private _handleMouseUp(e: React.MouseEvent<HTMLDivElement>) {
        this.props.drop('')
    }
    private _handleDoubleClick(e: React.MouseEvent<HTMLDivElement>) {
        this.props.createBox({ id: cuid(), x: e.clientX, y: e.clientY })
    }
}

const mapStateToProps = j((state: RootState) => ({
    boxes: state.boxList.map((id) => state.boxById[id]),
    lines: state.lineList
        .map((id) => state.lineById[id])
        .map((line) => ({
            ...line,
            from: state.boxById[line.from],
            to: state.boxById[line.to]
        })),
    editedBox: state.editingBox,
    draggedBox: state.draggedBox,
    lineType: state.lineType
}))
const mapDispatch = g((dispatch: Dispatch<RootState>) => (bindActionCreators(actions, dispatch)))

export default connect(mapStateToProps.fn, mapDispatch.fn)(App)
