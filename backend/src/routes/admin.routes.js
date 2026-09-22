import { Router } from "express";
import {
  getAllUsers,
  adminUpdateUser,
  adminUpdateUserScores,
  getDrawManagementData,
  simulateDraw,
  publishDraw,
  adminCreateCharity,
  adminUpdateCharity,
  adminDeleteCharity,
  getAllWinners,
  reviewWinnerProof,
  markWinnerPayoutPaid,
  getAdminReports
} from "../controllers/admin.controller.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";
import { USER_ROLES } from "../constants.js";

const router = Router();

// Protect all admin routes
router.use(verifyJWT);
router.use(authorizeRoles(USER_ROLES.ADMIN));

// Surface 01: User Management
router.get("/users", getAllUsers);
router.patch("/users/:userId", adminUpdateUser);
router.put("/users/:userId/scores", adminUpdateUserScores);

// Surface 02: Draw Management & Simulations
router.get("/draws", getDrawManagementData);
router.post("/draws/simulate", simulateDraw);
router.post("/draws/publish", publishDraw);

// Surface 03: Charity Management
router.post("/charities", adminCreateCharity);
router.patch("/charities/:charityId", adminUpdateCharity);
router.delete("/charities/:charityId", adminDeleteCharity);

// Surface 04: Winners Verification & Payouts
router.get("/winners", getAllWinners);
router.post("/winners/:winnerId/review", reviewWinnerProof);
router.post("/winners/:winnerId/payout", markWinnerPayoutPaid);

// Surface 05: Reports & Analytics
router.get("/reports", getAdminReports);

export default router;
