import { Box, Grid, Typography } from "@mui/material";
import { URLShortener } from "./URLShortener";

function App() {
    return (
        <main>
            <Grid
                container
                direction="column"
                justifyContent="space-between"
                alignItems="center"
                sx={{ height: "100vh" }}
            >
                <Box
                    sx={{
                        backgroundColor: "#1363DD",
                        width: "100%",
                        height: "100px",
                        margin: 0,
                    }}
                />
                <URLShortener />
                <Box
                    sx={{
                        backgroundColor: "#1363DD",
                        width: "100%",
                        height: "100px",
                        margin: 0,
                    }}
                />
            </Grid>
        </main>
    );
}

export default App;
