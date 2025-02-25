import express from "express";
import { erasRouter } from "./eras.js";
import { logger } from "./logger.js";
import { galleriesRouter } from "./galleries.js";
import { artistRouter } from "./artists.js";
import { paintingRouter } from "./paintings.js";
import { genreRouter } from "./genres.js";
import { countsRouter } from "./counts.js";

let app = express();

app.use(logger);
app.use("/api/eras", erasRouter);
app.use("/api/galleries", galleriesRouter);
app.use("/api/artists", artistRouter);
app.use("/api/paintings", paintingRouter);
app.use("/api/genre", genreRouter);
app.use("/api/counts", countsRouter);

app.listen(3000);
