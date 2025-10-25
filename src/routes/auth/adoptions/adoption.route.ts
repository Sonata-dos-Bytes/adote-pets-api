import { getAdoptionRequestsHistoryByUser } from "@controllers/adoption.controller"
import { Router } from "express"

const adoptionRouter = Router()

adoptionRouter.get("/adoption-requests", getAdoptionRequestsHistoryByUser)

export default adoptionRouter
