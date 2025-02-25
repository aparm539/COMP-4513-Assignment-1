import { createClient } from "@supabase/supabase-js";
import express from "express";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);
let getArtistsRoute = async (req, res) => {
  const { data, error } = await supabase.from("artists").select();
  res.send(data);
};

let getArtistRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("artists")
    .select()
    .eq("artistId", req.params.id);
  res.send(data);
};

let searchArtistByLastNameRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("artists")
    .select()
    .ilike("lastName", req.params.searchString.concat("%"));
  res.send(data);
};

let searchArtistsByNationalityRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("artists")
    .select()
    .ilike("nationality", req.params.searchString.concat("%"));
  res.send(data);
};

export let artistRouter = express.Router();
artistRouter.get("/", getArtistsRoute);
artistRouter.get("/:id", getArtistRoute);
artistRouter.get("/search/:searchString", searchArtistByLastNameRoute);
artistRouter.get("/country/:searchString", searchArtistsByNationalityRoute);
