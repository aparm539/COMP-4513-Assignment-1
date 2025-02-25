import { createClient } from "@supabase/supabase-js";
import express from "express";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

const SUPABASE_GENRE_SELECT = `
    genreId,
    genreName,
    eras (*),
    description,
    wikiLink
    `;

let getGenresRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("genre")
    .select(SUPABASE_GENRE_SELECT);
  res.send(data);
};

let getGenreRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("genre")
    .select(SUPABASE_GENRE_SELECT)
    .eq("genreId", req.params.id);
  res.send(data);
};

let getGenresByPaintingRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintinggenre")
    .select(`genre (*)`)
    .eq("paintingId", req.params.id)
    .order("genre(genreName)", { ascending: true });
  res.send(data);
};
export let genreRouter = express.Router();

genreRouter.get("/", getGenresRoute);
genreRouter.get("/:id", getGenreRoute);
genreRouter.get("/painting/:id", getGenresByPaintingRoute);
