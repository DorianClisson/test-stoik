import {
    Box,
    Button,
    Grid,
    IconButton,
    Link,
    TextField,
    Typography,
} from "@mui/material";
import axios, { AxiosResponse } from "axios";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useState } from "react";
import { isValidUrl } from "./helpers";

const API_URL = import.meta.env.VITE_API_URL;

export const URLShortener = (): React.JSX.Element => {
    const [longURL, setLongURL] = useState<string>("");
    const [shortURL, setShortURL] = useState<string>("");

    const shortenURL = async () => {
        // type should be shared between back & front for API (or use a solution like tRPC)
        const {
            data: { shortSlug },
        } = await axios.post<
            {},
            AxiosResponse<{ shortSlug: string }>,
            { fullURL: string }
        >(`${API_URL}/create`, {
            fullURL: longURL,
        });

        setShortURL(`${API_URL}/${shortSlug}`);
    };

    const isURLNotValid = !!longURL && !isValidUrl(longURL);

    return (
        <Grid container direction="column" sx={{ width: "max-content" }}>
            <Typography
                sx={{
                    fontWeight: "bold",
                    fontSize: "2rem",
                    marginBottom: "48px",
                }}
            >
                Stoik URL shortener
            </Typography>
            <TextField
                label="URL"
                value={longURL}
                error={isURLNotValid}
                helperText={isURLNotValid ? "URL not valid" : undefined}
                onChange={({ target: { value } }) => setLongURL(value)}
                sx={{ width: "500px" }}
            />
            <Button
                variant="contained"
                sx={{ marginTop: "48px" }}
                disabled={isURLNotValid}
                onClick={shortenURL}
            >
                SHORTEN URL
            </Button>
            <Box sx={{ height: "250px", padding: "50px" }}>
                {shortURL && (
                    <>
                        <Typography sx={{ marginBottom: "16px" }}>
                            Here is your shortened URL :
                        </Typography>
                        <>
                            <Link href={shortURL} target="_blank">
                                {shortURL}
                            </Link>
                            <IconButton
                                onClick={() => {
                                    navigator.clipboard.writeText(shortURL);
                                }}
                                sx={{ marginLeft: "16px", marginTop: "-5px" }}
                            >
                                <ContentCopyIcon />
                            </IconButton>
                        </>
                    </>
                )}
            </Box>
        </Grid>
    );
};
