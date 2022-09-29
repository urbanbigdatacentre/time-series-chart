// Component to render date filter toggle button group

import {ToggleButton, ToggleButtonGroup, styled} from "@mui/material";

const DateFilter = ({dateSelection, setDateSelection, startingDates}) => {
    return (
        <ToggleButtonGroup color={'primary'} value={dateSelection} exclusive onChange={(e) => setDateSelection(e.target.value)}>
            <ToggleButton value={startingDates['7Days']}>{"7 Days"}</ToggleButton>
            <ToggleButton value={startingDates['30Days']}>{"30 Days"}</ToggleButton>
            <ToggleButton value={startingDates['90Days']}>{"90 Days"}</ToggleButton>
            <ToggleButton value={startingDates['150Days']}>{"150 Days"}</ToggleButton>
            <ToggleButton value={startingDates['365Days']}>{"365 Days"}</ToggleButton>
        </ToggleButtonGroup>
    )
}

export default DateFilter;