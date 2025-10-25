import { destroy, myPets, store, update } from "@controllers/pet.controller";
import { Router } from "express";
import adoptionRouter from "./adoptions/adoption.route";
import authMiddleware from "src/middlewares/auth.middleware";

const router = Router();

router.post("/", store);

router.get("/my-pets", myPets);

router.put("/:externalId", update);

router.delete("/:externalId", destroy);

router.use('/:petExternalId/adoptions', adoptionRouter);

export default router;
