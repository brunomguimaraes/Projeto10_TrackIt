import { useContext } from "react";
import styled from "styled-components";
import isCreateHabitBoxHiddenContext from "../../../contexts/HabitsScreen/IsCreateHabitBoxHiddenContext";

export default function NewHabitButton() {
    const { setIsCreateNewHabitBoxHidden } = useContext(isCreateHabitBoxHiddenContext);

    return (
        <Main onClick = {() => setIsCreateNewHabitBoxHidden(false)}>
            +
        </Main>
    );
}

const Main = styled.button`
    width: 40px;
    height: 35px;
    border-radius: 5px;
    background-color: #52B6FF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    color: #FFFFFF;
    position: absolute;
    top: 86px;
    right: 18px;
    z-index: 1;
`