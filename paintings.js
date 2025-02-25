import { createClient } from "@supabase/supabase-js";
import express from "express";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);
const SUPABASE_SELECT_QUERY = `paintingId,
    artists (*), 
    galleries (*),
    imageFileName,
    title,
    shapeId,
    museumLink,
    accessionNumber,
    copyrightText,
    description,
    excerpt,
    yearOfWork,
    width,
    height,
    medium,
    cost,
    MSRP,
    googleLink,
    googleDescription,
    wikiLink,
    jsonAnnotations`;

let getPaintingsRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintings")
    .select(SUPABASE_SELECT_QUERY);

  res.send(data);
};

let getSortedPaintingsRoute = async (req, res) => {
  const columnValues = new Map([
    ["year", "yearOfWork"],
    ["title", "title"],
  ]);

  const { data, error } = await supabase
    .from("paintings")
    .select(SUPABASE_SELECT_QUERY)
    .order(columnValues.get(req.params.column));
  res.send(data);
};

let getPaintingRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintings")
    .select(SUPABASE_SELECT_QUERY)
    .eq("paintingId", req.params.id);
  res.send(data);
};

let searchPaintingByTitle = async (req, res) => {
  const searchTerm = "%".concat(req.params.searchString.concat("%"));
  const { data, error } = await supabase
    .from("paintings")
    .select(SUPABASE_SELECT_QUERY)
    .ilike("title", searchTerm);
  res.send(data);
};

let getPaintingsInYearRangeRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintings")
    .select(SUPABASE_SELECT_QUERY)
    .gte("yearOfWork", req.params.start)
    .lte("yearOfWork", req.params.end)
    .order("yearOfWork");
  res.send(data);
};

let getPaintingsByGalleryRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintings")
    .select(SUPABASE_SELECT_QUERY)
    .eq("galleryId", req.params.id);
  res.send(data);
};

let getPaintingsByArtistRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintings")
    .select(SUPABASE_SELECT_QUERY)
    .eq("artistId", req.params.id);
  res.send(data);
};

let searchPaintingsByArtistNationalityRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintings")
    .select(SUPABASE_SELECT_QUERY)
    .ilike("artists.nationality", req.params.searchString.concat("%"));
  res.send(data);
};

let getPaintingsByGenreRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintinggenre")
    .select(
      `paintings!inner(paintingId, title, yearOfWork)
      `
    )
    .eq("genreId", req.params.id)
    .order("yearOfWork", { referencedTable: "paintings", ascending: false });

  if (error) {
    console.error("Error fetching paintings:", error);
  }
  res.send(data);
};

let getPaintingsByEraRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintinggenre")
    .select(
      `
    painting:paintings!inner(paintingId, title, yearOfWork),
    genre!inner(eraId)
    `
    )
    .eq("genre.eraId", req.params.id)
    .order("yearOfWork", { referencedTable: "paintings", ascending: true });

  if (error) {
    console.error("Error fetching paintings:", error);
  }
  res.send(data);
};

export let paintingRouter = express.Router();
paintingRouter.get("/", getPaintingsRoute);
paintingRouter.get("/sort/:column", getSortedPaintingsRoute);
paintingRouter.get("/:id", getPaintingRoute);
paintingRouter.get("/search/:searchString", searchPaintingByTitle);
paintingRouter.get("/years/:start/:end/", getPaintingsInYearRangeRoute);
paintingRouter.get("/gallery/:id", getPaintingsByGalleryRoute);
paintingRouter.get("/artist/:id", getPaintingsByArtistRoute);
paintingRouter.get(
  "/artists/country/:searchString",
  searchPaintingsByArtistNationalityRoute
);
paintingRouter.get("/genre/:id", getPaintingsByGenreRoute);
paintingRouter.get("/era/:id", getPaintingsByEraRoute);
