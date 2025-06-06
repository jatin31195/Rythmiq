import { addAlbum, listAlbum, removeAlbum, getAlbumById } from "../Controllers/albumController.js";
import express from "express";
import {upload} from "../Middlewares/multer.js";

const albumRouter = express.Router();
import { ensureAdmin } from '../Middlewares/Auth.js';

albumRouter.post("/add", ensureAdmin, upload.single('image'), addAlbum);
albumRouter.get("/list", listAlbum);
albumRouter.delete("/remove", ensureAdmin, removeAlbum);
albumRouter.get("/:albumId", getAlbumById);
export default albumRouter;
