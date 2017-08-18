import * as React from "react"
import styled from 'styled-components'
import { Editor, EditorState, ContentBlock } from 'draft-js'
interface BoxProps {
    x: number,
    y: number,
    editable: boolean,
    dragging: boolean,
    id: string,
    selectBox: (id: string) => void,
    startDrag: (id: string, cx: number, cy: number, x: number, y: number) => void,
    editorState: EditorState,
    onChange: (id: string, editorState: EditorState) => void,
    onDrop(droppedId: string): void
    onSize(id: string, w: number, h: number): void
}
interface Bsp {
    x: number,
    y: number,
    dragging: boolean,
    editable: boolean
}
const BoxStyled = styled.div`
    position: fixed;
    left:${(p: Bsp) => p.x}px;
    top:${(p: Bsp) => p.y}px;
    user-select: none;
    cursor: ${(p) => p.editable ? 'inherit' : 'pointer'};
    transition: box-shadow 0.3s cubic-bezier(.25,.8,.25,1);
    box-shadow: ${(p: Bsp) =>
        p.editable ?
            '0 0px 4px 2px #46D1EA, 0 0px 2px 1px #46D1EA' :
            p.dragging ?
                '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' :
                '0 1px 6px rgba(0, 0, 0, 0.12), 0 1px 4px rgba(0, 0, 0, 0.12)'
    };
    z-index: ${(p: Bsp) => p.dragging ? 1 : 0};
    pointer-events: ${(p: Bsp) => p.dragging ? 'none' : 'auto'};
    background: #fff;
    border-radius: 4px;
    padding: 15px 0;
    box-sizing: border-box;
`
const HandleSpan = (props: { children: React.ReactChildren }) => {
    const style = {
        color: '#99ff22',
        borderTop: '1px solid #bbb',
        height: 0,
        marginTop: 8,
        marginBottom: 8,
        width: '100%',
        display: 'inline-block'
    }
    return (
        <span
            style={style}
        >
            {props.children}
        </span>
    )
}
function myBlockRenderer(contentBlock: ContentBlock) {
    const text = contentBlock.getText()
    if (text === '---') {
        return {
            component: HandleSpan,
            editable: true,
            type: 'hr',
            props: {
                foo: 'bar',
            },
        }
    }
    return null
}
export class BoxView extends React.Component<BoxProps> {
    private r: Editor
    private bs: HTMLDivElement
    constructor(props: BoxProps, context?: any) {
        super(props, context)
        this.startEditing = this.startEditing.bind(this)
        this.startDrag = this.startDrag.bind(this)
        this.onChange = this.onChange.bind(this)
        this.onBlur = this.onBlur.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.setInnerRef = this.setInnerRef.bind(this)
    }
    public componentDidMount() {
        const { width, height } = this.bs.getBoundingClientRect()
        this.props.onSize(this.props.id, width, height)
        this.props.selectBox(this.props.id)
    }
    public componentDidUpdate(prevProps: BoxProps) {
        if (prevProps.editable !== this.props.editable) {
            if (this.props.editable) { this.r.focus() }
        }
    }
    public render() {
        return (
            <BoxStyled
                innerRef={this.setInnerRef}
                x={this.props.x}
                y={this.props.y}
                onDoubleClick={this.startEditing}
                onDragStart={this.startDrag}
                onMouseUp={this.onMouseUp}
                dragging={this.props.dragging}
                editable={this.props.editable}
                draggable={true}
            >
                <Editor
                    ref={(r) => this.r = r!}
                    onBlur={this.onBlur}
                    editorState={this.props.editorState}
                    onChange={this.onChange}
                    readOnly={!this.props.editable}
                    blockRendererFn={myBlockRenderer}
                    blockStyleFn={this.myBlockStyleFn}
                />
            </BoxStyled>
        )
    }
    private onBlur() {
        this.props.selectBox('')
    }
    private setInnerRef(bs: HTMLDivElement) {
        this.bs = bs
    }
    private onMouseUp() {
        this.props.onDrop(this.props.id)
    }
    private startEditing(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault()
        e.stopPropagation()
        this.props.selectBox(this.props.id)
    }
    private startDrag(e: React.MouseEvent<HTMLDivElement>) {
        e.preventDefault()
        const cx = e.clientX
        const cy = e.clientY
        setTimeout(
            () => {
                if (!this.props.editable) {
                    this.props.startDrag(this.props.id, cx, cy, this.props.x, this.props.y)
                }
            },
            0
        )
    }
    private onChange(e: EditorState) {
        const { width, height } = this.bs.getBoundingClientRect()
        this.props.onChange(this.props.id, e)
        this.props.onSize(this.props.id, width, height)
    }
    private myBlockStyleFn(contentBlock: ContentBlock) {
        if (contentBlock.getText() === '---') { return 'hr' }
        return 'unstyled'
    }
}
