import { Router } from "express";
import multer from "multer";
import authMiddleware from "src/middlewares/auth.middleware";
import { PetController } from "src/controllers/pet.controller";

const router = Router();

// Configuração do multer (usa memória para enviar o buffer ao S3)
const upload = multer({ storage: multer.memoryStorage() });

// 🔓 Rotas públicas
router.get("/", PetController.index);      // Listar pets disponíveis
router.get("/:id", PetController.show);    // Ver detalhes de um pet

// 🔐 Rotas protegidas
router.get("/me/list", authMiddleware, PetController.myPets); // Pets do usuário autenticado

router.post(
  "/",
  authMiddleware,
  upload.array("images"), // aceita múltiplos arquivos no campo "images"
  PetController.store
);

router.put(
  "/:id",
  authMiddleware,
  upload.array("images"),
  PetController.update
);

router.delete("/:id", authMiddleware, PetController.delete);

export default router;
