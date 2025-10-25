import {
  createAdoptionRequest,
  deleteAdoptionRequest,
  showPetAdoptionRequests,
  showPetAdoptionRequest,
} from "@controllers/adoption.controller"
import { Router } from "express"

const adoptionRequestRouter = Router()

adoptionRequestRouter.post("/:petId/requests", createAdoptionRequest)

adoptionRequestRouter.get("/:petId/requests", showPetAdoptionRequests)

adoptionRequestRouter.get("/:petId/requests/:requestId", showPetAdoptionRequest)

adoptionRequestRouter.delete("/:petId/requests", deleteAdoptionRequest)

export default adoptionRequestRouter
