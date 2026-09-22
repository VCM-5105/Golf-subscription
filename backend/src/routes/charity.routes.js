import { Router } from "express";
import {
  getAllCharities,
  getCharityById,
  getSpotlightCharity,
  makeDirectDonation,
  updateUserCharitySelection
} from "../controllers/charity.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", getAllCharities);
router.get("/spotlight", getSpotlightCharity);
router.get("/:charityId", getCharityById);

// Direct donation can be made by both visitors and registered members
router.post("/donate", (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  if (token) {
    return verifyJWT(req, res, () => makeDirectDonation(req, res, next));
  }
  return makeDirectDonation(req, res, next);
});

// Update user's recurring subscription charity selection
router.post("/select", verifyJWT, updateUserCharitySelection);

export default router;
