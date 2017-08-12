import * as React from "react";
import styled from 'styled-components'
const BoxStyled = styled.div`
    padding: 5px;
    border: 1px solid #f5f5f5;
`
const Box = () => <BoxStyled>hello</BoxStyled>

export interface HelloProps { compiler: string; framework: string; }
export const Hello = () =>
    <div>
        <Box />
    </div>