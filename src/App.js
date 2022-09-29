import logo from './logo.svg';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import DateFilter from "./components/date-filter";
import {useState} from "react";
import {Box} from "@mui/material";
import Chart from "./components/chart";

// Create Material UI theme to set JetBrains Mono as the default font family
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


// Core App component feat. Date Filter component
function App() {

    // Object storing actual date selections inside App component
    const startingDates = {
        "7Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0, 0, 0, 0)),
        "30Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 30)).setHours(0, 0, 0, 0)),
        "90Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 90)).setHours(0, 0, 0, 0)),
        "150Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 150)).setHours(0, 0, 0, 0)),
        "365Days": JSON.stringify(new Date(new Date().setDate(new Date().getDate() - 365)).setHours(0, 0, 0, 0))
    }

    const [dateSelection, setDateSelection] = useState(startingDates["365Days"]);

    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <Box sx={{display: `flex`, alignItems: `center`, justifyContent: `center`, height: `33vh`}}>
                    <DateFilter dateSelection={dateSelection} setDateSelection={setDateSelection} startingDates={startingDates}/>
                </Box>
                <Box id={'chart-container'} sx={{display: `flex`, alignItems: `center`, justifyContent: `center`, height: `67vh`}}>
                    <Chart dateSelection={dateSelection}/>
                </Box>
            </div>
        </ThemeProvider>
    );
}



export default App;
