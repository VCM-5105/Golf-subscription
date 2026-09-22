import { Router } from "express";
import {
  getMyWinnings,
  submitWinnerProof
} from "../controllers/winner.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/my-winnings", getMyWinnings);
router.post("/:winnerId/proof", upload.single("proofImage"), submitWinnerProof);

export default router;
