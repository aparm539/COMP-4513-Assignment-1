import { createClient } from "@supabase/supabase-js";
import express from "express";

let getGalleriesRoute = async (req, res) => {
  const { data, error } = await supabase.from("galleries").select();
  res.send(data);
};

let getGalleryRoute = async (req, res) => {
  const { data, error } = await supabase
    .from("galleries")
    .select()
    .eq("galleryId", req.params.id);
  res.send(data);
};

let searchGalleryByCountry = async (req, res) => {
  const { data, error } = await supabase
    .from("galleries")
    .select()
    .ilike("galleryCountry", req.params.searchString.concat("%"));
  res.send(data);
};
// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export let galleriesRouter = express.Router();

galleriesRouter.get("/", getGalleriesRoute);
galleriesRouter.get("/:id", getGalleryRoute);
galleriesRouter.get("/country/:searchString", searchGalleryByCountry);
