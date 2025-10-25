import { destroy, myPets, store, update } from "@controllers/pet.controller";
import { Router } from "express";

const router = Router();

router.post("/", store);

router.get("/my-pet", myPets);

router.put("/:id", update);

router.delete("/:id", destroy);

export default router;
