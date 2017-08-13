import * as React from "react";
import styled, { ThemedStyledFunction } from 'styled-components'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState, actionCreators } from '../reducers'

type bsp = { x: number, y: number }
const BoxStyled = styled.div`
    position: fixed;
    padding: 5px;
    border: 1px solid #f5f5f5;
    left:${(p: bsp) => p.x}px;
    top:${(p: bsp) => p.y}px;
    user-select: none;
`
interface BoxProps {
    x: number,
    y: number,
    selected: boolean,
    id: string
}
class BoxView extends React.Component<any, BoxProps> {
    componentDidUpdate(prevProps: BoxProps) {
        if (prevProps.selected !== this.props.selected) {
            if (this.props.selected) {
                console.log(this.r);
                this.r.focus();
            }
        }
    }
    private r: HTMLDivElement
    mp(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onClick(this.props.id)
    }
    mip(e: React.FocusEvent<HTMLDivElement>) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onClick('')
    }
    render() {
        let props = this.props;
        return (
            <BoxStyled
                x={props.x}
                y={props.y}
                contentEditable={props.selected}
                onDoubleClick={(e) => this.mp(e)}
                innerRef={(r) => this.r = r}
                onBlur={(e) => this.mip(e)}
            >
                hello
            </BoxStyled>
        )
    }
}
const Canvas = styled.div`
    position: absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
`

const mapStateToProps = (state: RootState) => ({
    boxes: state.boxesList.map((id) => state.boxesById[id]),
    selectedBox: state.selectedBox
})
const mapDispatch = (dispatch: Dispatch<RootState>) => ({
    createBox(x: number, y: number) {
        dispatch(actionCreators.createBox(x, y))
    },
    selectBox(id: string) {
        dispatch(actionCreators.selectBox(id))
    }
})
export const Hello = connect(mapStateToProps, mapDispatch)(
    (props) =>
        <Canvas onDoubleClick={(e) => props.createBox(e.clientX, e.clientY)}>
            {props.boxes.map((box) =>
                <BoxView
                    key={box.id}
                    selected={box.id === props.selectedBox}
                    x={box.x}
                    y={box.y}
                    id={box.id}
                    onClick={props.selectBox}
                />
            )}
        </Canvas>
)