import {
  createAdoptionRequest,
  deleteAdoptionRequest,
  showPetAdoptionRequests,
  showPetAdoptionRequest,
} from "@controllers/adoption.controller"
import { Router } from "express"

const adoptionRequestRouter = Router()

adoptionRequestRouter.get("/requests", showPetAdoptionRequests)

adoptionRequestRouter.post("/requests", createAdoptionRequest)

adoptionRequestRouter.get("/requests/:externalId", showPetAdoptionRequest)

adoptionRequestRouter.delete("/requests/:externalId", deleteAdoptionRequest)

export default adoptionRequestRouter
