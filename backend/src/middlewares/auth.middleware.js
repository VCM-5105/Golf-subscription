import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { supabase } from "../db/index.js";
import { SUBSCRIPTION_STATUS, USER_ROLES } from "../constants.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ApiError(401, "Unauthorized request. Please log in.");
  }

  try {
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET || "super_secret_golf_platform_jwt_key_2025_safe"
    );

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", decodedToken.id)
      .maybeSingle();

    if (error || !user) {
      throw new ApiError(401, "Invalid Access Token or user no longer exists.");
    }

    const { password, ...safeUser } = user;
    req.user = safeUser;
    next();
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid or expired token.");
  }
});

export const requireActiveSubscription = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    throw new ApiError(401, "Authentication required.");
  }

  // Admins always have full bypass access
  if (req.user.role === USER_ROLES.ADMIN) {
    return next();
  }

  const sub = req.user.subscription;
  if (!sub || sub.status !== SUBSCRIPTION_STATUS.ACTIVE) {
    throw new ApiError(
      403,
      "Active subscription required to access this feature. Please activate your membership."
    );
  }

  next();
});

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        `Access denied. Requires one of roles: [${roles.join(", ")}]`
      );
    }
    next();
  };
};
