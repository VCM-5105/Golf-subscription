import { Router } from "express";
import {
  getPlans,
  subscribe,
  cancelSubscription,
  getSubscriptionStatus
} from "../controllers/subscription.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/plans", getPlans);
router.get("/status", verifyJWT, getSubscriptionStatus);
router.post("/subscribe", verifyJWT, subscribe);
router.post("/cancel", verifyJWT, cancelSubscription);

export default router;
