import { index, show } from "@controllers/pet.controller";
import { Router } from "express";

const router = Router();

router.get("/", index);

router.get("/:id", show);

export default router;
