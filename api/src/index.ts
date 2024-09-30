import express from "express";
import bodyParser from "body-parser";
import { databaseConnection } from "./dbConnection";
import { IURLDocument } from "./types";
import { isValidUrl } from "./helpers";
import { nanoid } from "nanoid";
import cors, { CorsOptions } from "cors";

const app = express();
const port = 3001;

// cors
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        callback(null, true); // no CORS check for simplification for this test
    },
};
app.use(cors(corsOptions));

// body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoCollection = "urls";

// CREATE API
app.post<{}, {}, { fullURL: string }>("/create", async (req, res) => {
    const { fullURL } = req.body;

    try {
        if (!fullURL) {
            res.status(400).send(
                "Bad Request - Missing fullURL field in body.",
            );
            return;
        }

        if (!isValidUrl(fullURL)) {
            res.status(400).send("Bad Request - fullURL given is not an URL.");
            return;
        }

        const db = await databaseConnection();

        // check if already exist
        const existingDocument = await db
            .collection<IURLDocument>(mongoCollection)
            .findOne({ fullURL: fullURL });

        if (existingDocument) {
            res.status(200).send({ shortSlug: existingDocument.shortSlug });
            return;
        }

        // else create
        const createdSlug = nanoid();
        await db
            .collection<IURLDocument>(mongoCollection)
            .insertOne({ shortSlug: createdSlug, fullURL: fullURL });

        res.status(201).send({ shortSlug: createdSlug });
        return;
    } catch (err) {
        res.status(500).send({ error: "Something failed!" }); // default ERROR handler for this test
    }
});

// READ API
app.get("/:shortSlug", async (req, res) => {
    const { shortSlug } = req.params;

    try {
        const db = await databaseConnection();

        const urlDocument = await db
            .collection<IURLDocument>(mongoCollection)
            .findOne(
                { shortSlug: shortSlug },
                { projection: { _id: 0, fullURL: 1 } },
            );

        if (!urlDocument) {
            res.status(404).send("Not found - This short URL does not exist.");
            return;
        }

        res.redirect(301, urlDocument.fullURL);
        return;
    } catch (err) {
        res.status(500).send({ error: "Something failed!" }); // default ERROR handler for this test
    }
});

app.listen(port, () => {
    console.log(`STOIK URL SHORTENER BACKEND listening on port ${port}`);
});
