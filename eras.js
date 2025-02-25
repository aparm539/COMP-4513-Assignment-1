import { createClient } from "@supabase/supabase-js";
import express from "express";

let getErasRoute = async (req, res) => {
  const { data, error } = await supabase.from("eras").select();
  res.send(data);
};
// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_API_KEY
);

export let erasRouter = express.Router();

erasRouter.get("/", getErasRoute);
