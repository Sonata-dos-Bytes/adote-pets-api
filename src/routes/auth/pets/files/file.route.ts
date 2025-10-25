import { deletePetFile, getPetFiles, setPetFileAsMain, uploadPetFile } from "@controllers/pet-file.controller"
import { Router } from "express"

const router = Router({ mergeParams: true })

router.get("/", getPetFiles)

router.post("/", uploadPetFile)

router.delete("/:externalId", deletePetFile)

router.patch("/:externalId/set-as-main", setPetFileAsMain)

export default router
