import express from "express";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

let getGenreCountRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintinggenre")
    .select(`count(), genre(genreName)`);

  if (error) {
    console.error("Error fetching paintings:", error);
  }
  res.send(data);
};

let getArtistsCount = async (req, res) => {
  const { data, error } = await supabase
    .from("paintings")
    .select(`count(), artists(firstName, lastName)`)
    .order("count");
  let cleanedData = [];
  data.forEach((value) => {
    cleanedData.push({
      "artist name": value.artists.firstName.concat(
        " ".concat(value.artists.lastName)
      ),
      count: value.count,
    });
  });

  if (error) {
    console.error("Error fetching paintings:", error);
  }
  res.send(cleanedData);
};

let getTopGenresRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("paintinggenre")
    .select(`count(), genre(genreName)`);
  let filteredData = data.filter((value) => value.count >= req.params.count);
  let cleanedData = [];
  filteredData.forEach((value) => {
    cleanedData.push({
      "Genre Name": value.genre.genreName,
      Count: value.count,
    });
  });

  if (error) {
    console.error("Error fetching paintings:", error);
  }
  res.send(cleanedData);
};

export let countsRouter = express.Router();

countsRouter.get("/genres", getGenreCountRoute);
countsRouter.get("/artists", getArtistsCount);
countsRouter.get("/topgenres/:count", getTopGenresRoute);
