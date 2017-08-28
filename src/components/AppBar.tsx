import * as React from "react"
import styled from 'styled-components'
import { AppBar, Toolbar, Typography, IconButton, Icon } from 'material-ui'

interface AppProps {
    title: string,
    onToggle: ({ }) => void,
    lineToggle: boolean
}
const SearchBar = styled.div`
    background: rgba(255, 255, 255, 0.15);
    border: none;
    border-radius: 4px;
    color: #FFF;
    font-size: 16px;
    display: flex;
    flex: 1;
    max-width: 800px;
    margin-right: auto;
    margin-left: auto;
`
const SearchInput = styled.input`
    background: transparent;
    border: none;
    height: 36px;
    border-radius: 4px;
    color: #FFF;
    font-size: 13px;
    outline: none;
    flex: 1;
    font-weight: 300;
    &::placeholder{
        color: #FFF;
    }
`

export default class AppBarG extends React.Component<AppProps> {

    public state = {
        anchorEl: undefined,
        open: false,
        expanded: false,
    }

    constructor(props: AppProps, context?: any) {
        super(props, context)
        this.toggle = this.toggle.bind(this)
        this.expand = this.expand.bind(this)
    }

    public render() {
        return (
            <AppBar position="fixed" style={{ zIndex: 4 }} color="primary" >
                <Toolbar>
                    <Typography type="title" color="inherit" style={{ flex: 0 }}>
                        {this.props.title}
                    </Typography>

                    <SearchBar>
                        <Icon style={{ padding: '6px 0', width: 72, textAlign: 'center' }} >
                            {this.state.expanded ? 'close' : 'search'}
                        </Icon>
                        <SearchInput placeholder={'Search'} />
                    </SearchBar>

                    <IconButton
                        aria-label="More"
                        aria-owns={this.state.open ? 'long-menu' : null}
                        aria-haspopup="true"
                        onClick={this.toggle}
                        color="contrast"
                    >
                        <Icon>{this.props.lineToggle ? "timeline" : "linear_scale"}</Icon>
                    </IconButton>
                </Toolbar>
            </AppBar>
        )
    }
    private toggle() {
        this.props.onToggle({})
    }
    private expand() {
        this.setState({ expanded: !this.state.expanded })
    }
}
