import { Router } from "express";
import {
  getActiveDraw,
  getDrawHistory,
  getDrawDetails,
  getMyDrawTicket
} from "../controllers/draw.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Publicly viewable active pool and past published draws
router.get("/active", (req, res, next) => {
  // Optional auth: if token present, attach req.user so activeDraw includes their ticket
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    return verifyJWT(req, res, () => getActiveDraw(req, res, next));
  }
  return getActiveDraw(req, res, next);
});

router.get("/history", getDrawHistory);
router.get("/my-ticket", verifyJWT, getMyDrawTicket);
router.get("/:drawId", getDrawDetails);

export default router;
