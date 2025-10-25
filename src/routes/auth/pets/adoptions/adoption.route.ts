import {
  createAdoptionRequest,
  deleteAdoptionRequest,
  showPetAdoptionRequests,
  showPetAdoptionRequest,
} from "@controllers/adoption.controller"
import { Router } from "express"

const router = Router({ mergeParams: true })

router.get("/requests", showPetAdoptionRequests)

router.post("/requests", createAdoptionRequest)

router.get("/requests/:externalId", showPetAdoptionRequest)

router.delete("/requests/:externalId", deleteAdoptionRequest)

export default router
