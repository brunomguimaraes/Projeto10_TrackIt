import Container from "../../shared/styles/Container";
import HabitDueToday from "./components/HabitDueToday";
import ScreenTitle from "../../shared/components/ScreenTitle";
import ScreenSubtitle from "./components/ScreenSubtitle";
import ScreenDescription from "../../shared/components/ScreenDescription";
import dayjs from "dayjs"
import { useContext, useEffect, useState } from "react";
import UserProfileDataContext from "../../contexts/App/UserProfileDataContext";
import UserHabitsDataContext from "../../contexts/App/UserHabitsDataContext";
import Loading from "../../shared/components/Loading";
import { DownloadHabitsDueToday } from "../../services/axiosServices.js";
import { adjustStateObjectData, TodaysHabitsCompletionPercentage} from "../../shared/functions/Functions";
import { useHistory } from "react-router";
import HabitRequestContext from "../../contexts/HabitsScreen/HabitRequestContext";
import Swal from 'sweetalert2';

export default function TodaysHabitsScreen({ setAreFixedBarsHidden }) {

    const { userProfileData } = useContext(UserProfileDataContext);
    const { userHabitsData, setUserHabitsData } = useContext(UserHabitsDataContext);
    const { isHabitRequestBeingValidated } = useContext(HabitRequestContext);
    const browsingHistory = useHistory();

    useEffect( () => {
        setAreFixedBarsHidden(false);
        DownloadHabitsDueToday(userProfileData.token)
            .then( resp => {
                adjustStateObjectData({
                    objectToChange: userHabitsData,
                    setObjectToChange: setUserHabitsData,
                    atributesToChange: ["todaysHabits", "todaysCompletionPercentage"],
                    atributesNewValues: [resp.data, TodaysHabitsCompletionPercentage(resp.data)]
                });
            })
            .catch( error => {
                Swal.fire({
                    title: `Parece que houve algum erro!`,
                    text: `Por favor, tente fazer seu login novamente`,
                    icon: 'error',
                  });
                browsingHistory.push("/")
            })
    },[isHabitRequestBeingValidated])

    if (!userHabitsData.todaysHabits) {
        return (
            <Container backgroundColor = "#F2F2F2" horizontalPadding = "18px" topPadding = "92px" bottomPadding = "120px" >
                <Loading />
            </Container>
        );
    }

    return (
        <Container backgroundColor = "#F2F2F2" horizontalPadding = "18px" topPadding = "92px" bottomPadding = "120px" >
            <ScreenTitle text = {StructuredTodaysDate()} />
            <ScreenSubtitle completionPercentage = {userHabitsData.todaysCompletionPercentage} />
            { userHabitsData.todaysHabits.map( (habit) => <HabitDueToday key = {habit.id} habit = { habit } /> ) }
            {userHabitsData.todaysHabits.length ? "" : 
                <ScreenDescription text = {"Você não tem nenhum hábito cadastrado para hoje. Que tal mudarmos isso?"} />
            }
        </Container>
    );
}

function StructuredTodaysDate() {
    const WeekdayCodeCorrelation = [
        {code: 0, weekday: "Domingo"},
        {code: 1, weekday: "Segunda"},
        {code: 2, weekday: "Terça"},
        {code: 3, weekday: "Quarta"},
        {code: 4, weekday: "Quinta"},
        {code: 5, weekday: "Sexta"},
        {code: 6, weekday: "Sábado"},
    ]
    const WeekdayName = WeekdayCodeCorrelation.find( ({ code }) => code === dayjs().day() ).weekday
    return `${WeekdayName}, ${dayjs().format('DD/MM')}`
}