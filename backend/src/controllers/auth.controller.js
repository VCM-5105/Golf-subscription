import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { supabase } from "../db/index.js";
import { USER_ROLES, SUBSCRIPTION_STATUS, CHARITY_CONFIG } from "../constants.js";

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "super_secret_golf_platform_jwt_key_2025_safe",
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, charityId, charityPercentage, handicap, role } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "Name, email, and password are required.");
  }

  // Check if user already exists
  const { data: existing, error: checkErr } = await supabase
    .from("users")
    .select("id")
    .ilike("email", email.toLowerCase())
    .maybeSingle();

  if (checkErr) {
    throw new ApiError(500, `Database error: ${checkErr.message}. Ensure supabase_schema.sql has been executed in your Supabase SQL editor.`);
  }

  if (existing) {
    throw new ApiError(409, "A user with this email already exists.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Dynamic charity selection (only if chosen by user)
  let selectedCharity = null;
  if (charityId) {
    const { data: ch } = await supabase
      .from("charities")
      .select("id, name")
      .eq("id", charityId)
      .maybeSingle();

    if (ch) {
      selectedCharity = {
        charityId: ch.id,
        charityName: ch.name,
        percentage: Math.max(CHARITY_CONFIG.MIN_CONTRIBUTION_PERCENT, Number(charityPercentage) || 10)
      };
    }
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
    role: USER_ROLES.SUBSCRIBER,
    subscription: {
      status: SUBSCRIPTION_STATUS.INACTIVE,
      planId: null,
      planName: null,
      startedAt: null,
      renewalDate: null,
      price: 0
    },
    charity: selectedCharity,
    handicap: Number(handicap) || 0
  };

  const { data: created, error } = await supabase
    .from("users")
    .insert([newUser])
    .select()
    .single();

  if (error) {
    throw new ApiError(500, error.message || "Failed to create user account.");
  }

  const token = generateToken(created);
  const { password: _, ...userSafe } = created;

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { user: userSafe, token }, "Account created successfully."));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required.");
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .ilike("email", email.toLowerCase().trim())
    .maybeSingle();

  if (error) {
    throw new ApiError(500, `Database error during login: ${error.message}`);
  }

  if (!user) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password.");
  }

  const token = generateToken(user);
  const { password: _, ...userSafe } = user;

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { user: userSafe, token }, "Logged in successfully."));
});

export const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("accessToken");
  return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully."));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", req.user.id)
    .maybeSingle();

  if (error || !user) {
    throw new ApiError(404, "User not found.");
  }

  const { password: _, ...userSafe } = user;
  return res
    .status(200)
    .json(new ApiResponse(200, userSafe, "Current user fetched."));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, handicap } = req.body;
  const updates = {
    updated_at: new Date().toISOString()
  };

  if (name) updates.name = name.trim();
  if (handicap !== undefined) updates.handicap = Number(handicap);

  const { data: updated, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", req.user.id)
    .select()
    .single();

  if (error || !updated) {
    throw new ApiError(500, "Failed to update profile.");
  }

  const { password: _, ...userSafe } = updated;
  return res
    .status(200)
    .json(new ApiResponse(200, userSafe, "Profile updated successfully."));
});
