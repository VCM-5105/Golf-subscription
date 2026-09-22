import { Router } from "express";
import {
  getMyScores,
  addScore,
  updateScore,
  deleteScore
} from "../controllers/score.controller.js";
import {
  verifyJWT,
  requireActiveSubscription
} from "../middlewares/auth.middleware.js";

const router = Router();

// Score management requires valid authentication & active subscription (§ 04)
router.use(verifyJWT);
router.use(requireActiveSubscription);

router.get("/", getMyScores);
router.post("/", addScore);
router.patch("/:scoreId", updateScore);
router.delete("/:scoreId", deleteScore);

export default router;
