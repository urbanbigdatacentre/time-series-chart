import logo from './logo.svg';
import './App.css';
import DateFilter from "./components/date-filter";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {Box} from "@mui/material";
import Chart from "./components/chart";
import {useState} from "react";

const theme = createTheme({
    typography: {
        allVariants: {
            fontFamily: 'JetBrains Mono',
        },
    },
    palette: {
        primary: {
            main: '#2196F3',
        },
        secondary: {
            main: '#1565C0',
        },
    }
});


function App() {

    const startingDates = {
        "7Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0)),
        "30Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0)),
        "90Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 90)).setHours(0, 0, 0, 0)),
        "150Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 150)).setHours(0, 0, 0, 0)),
        "365Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 365)).setHours(0, 0, 0, 0))
    }

    const [dateSelection, setDateSelection] = useState(startingDates["7Days"]);

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Box sx={{display: `flex`, alignItems: `center`, justifyContent: `center`, height: `33vh`}}>
                    <DateFilter dateSelection={dateSelection} setDateSelection={setDateSelection} startingDates={startingDates}/>
                </Box>
                <Box sx={{display: `flex`, alignItems: `center`, justifyContent: `center`, height: `67vh`}}>
                    <Chart dateSelection={dateSelection}/>
                </Box>
            </div>
        </ThemeProvider>
    );
}

export default App;
