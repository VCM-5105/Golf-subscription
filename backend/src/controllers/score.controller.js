import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { supabase } from "../db/index.js";
import { SCORE_CONSTRAINTS } from "../constants.js";
import { syncUserDrawTicket } from "../utils/ticketSync.js";

export const getMyScores = asyncHandler(async (req, res) => {
  const { data: scores, error } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false });

  if (error) {
    throw new ApiError(500, "Failed to retrieve scores.");
  }

  const scoreList = scores || [];
  const totalEntered = scoreList.length;
  const isComplete = totalEntered === SCORE_CONSTRAINTS.MAX_RETAINED_SCORES;

  // Calculate statistics
  const avgScore = totalEntered > 0
    ? (scoreList.reduce((sum, s) => sum + s.score, 0) / totalEntered).toFixed(1)
    : 0;
  const bestScore = totalEntered > 0 ? Math.max(...scoreList.map((s) => s.score)) : 0;
  const lowestScore = totalEntered > 0 ? Math.min(...scoreList.map((s) => s.score)) : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        scores: scoreList,
        count: totalEntered,
        maxRetained: SCORE_CONSTRAINTS.MAX_RETAINED_SCORES,
        isComplete,
        statistics: {
          average: Number(avgScore),
          best: bestScore,
          lowest: lowestScore
        }
      },
      "Scores retrieved successfully in reverse chronological order."
    )
  );
});

export const addScore = asyncHandler(async (req, res) => {
  const { score, date, course, notes } = req.body;

  if (score === undefined || !date) {
    throw new ApiError(400, "Both Stableford score (1-45) and play date are required.");
  }

  const numericScore = Number(score);
  if (
    isNaN(numericScore) ||
    numericScore < SCORE_CONSTRAINTS.MIN_STABLEFORD ||
    numericScore > SCORE_CONSTRAINTS.MAX_STABLEFORD
  ) {
    throw new ApiError(
      400,
      `Stableford score must be an integer between ${SCORE_CONSTRAINTS.MIN_STABLEFORD} and ${SCORE_CONSTRAINTS.MAX_STABLEFORD}.`
    );
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new ApiError(400, "Invalid date provided.");
  }
  const formattedDate = parsedDate.toISOString().split("T")[0];

  // Insert new score
  const newScoreObj = {
    id: `sc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    user_id: req.user.id,
    score: Math.round(numericScore),
    date: formattedDate,
    course: course?.trim() || "Course Round",
    notes: notes?.trim() || ""
  };

  const { data: createdScore, error: insertErr } = await supabase
    .from("scores")
    .insert(newScoreObj)
    .select()
    .single();

  if (insertErr) {
    if (insertErr.code === "23505") {
      throw new ApiError(400, "A score for this date has already been recorded.");
    }
    throw new ApiError(400, insertErr.message || "Failed to save score.");
  }

  // Enforce FIFO: retain only the 5 most recent scores
  const { data: allUserScores } = await supabase
    .from("scores")
    .select("id, date")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false });

  if (allUserScores && allUserScores.length > SCORE_CONSTRAINTS.MAX_RETAINED_SCORES) {
    const idsToDelete = allUserScores
      .slice(SCORE_CONSTRAINTS.MAX_RETAINED_SCORES)
      .map((s) => s.id);

    if (idsToDelete.length > 0) {
      await supabase.from("scores").delete().in("id", idsToDelete);
    }
  }

  // Synchronize draw ticket
  await syncUserDrawTicket(req.user.id);

  const { data: updatedScores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false });

  const currentList = updatedScores || [];

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        newScore: createdScore,
        scores: currentList,
        message: currentList.length === 5
          ? "Score recorded. Your 5-score ticket for the monthly draw is active!"
          : `Score recorded. ${5 - currentList.length} more needed to activate your draw ticket.`
      },
      "Score recorded successfully."
    )
  );
});

export const updateScore = asyncHandler(async (req, res) => {
  const { scoreId } = req.params;
  const { score, date, course, notes } = req.body;

  const updates = {
    updated_at: new Date().toISOString()
  };

  if (score !== undefined) {
    const num = Number(score);
    if (
      isNaN(num) ||
      num < SCORE_CONSTRAINTS.MIN_STABLEFORD ||
      num > SCORE_CONSTRAINTS.MAX_STABLEFORD
    ) {
      throw new ApiError(
        400,
        `Stableford score must be between ${SCORE_CONSTRAINTS.MIN_STABLEFORD} and ${SCORE_CONSTRAINTS.MAX_STABLEFORD}.`
      );
    }
    updates.score = Math.round(num);
  }

  if (date) {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new ApiError(400, "Invalid date format.");
    }
    updates.date = parsedDate.toISOString().split("T")[0];
  }

  if (course !== undefined) updates.course = course.trim();
  if (notes !== undefined) updates.notes = notes.trim();

  const { data: updated, error } = await supabase
    .from("scores")
    .update(updates)
    .eq("id", scoreId)
    .eq("user_id", req.user.id)
    .select()
    .maybeSingle();

  if (error || !updated) {
    throw new ApiError(404, "Score entry not found or update failed.");
  }

  await syncUserDrawTicket(req.user.id);

  const { data: currentScores } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false });

  return res.status(200).json(
    new ApiResponse(200, { updatedScore: updated, scores: currentScores || [] }, "Score updated successfully.")
  );
});

export const deleteScore = asyncHandler(async (req, res) => {
  const { scoreId } = req.params;

  const { data: deleted, error } = await supabase
    .from("scores")
    .delete()
    .eq("id", scoreId)
    .eq("user_id", req.user.id)
    .select()
    .maybeSingle();

  if (error || !deleted) {
    throw new ApiError(404, "Score entry not found or already deleted.");
  }

  await syncUserDrawTicket(req.user.id);

  const { data: remaining } = await supabase
    .from("scores")
    .select("*")
    .eq("user_id", req.user.id)
    .order("date", { ascending: false });

  return res.status(200).json(
    new ApiResponse(200, { scores: remaining || [] }, "Score deleted successfully.")
  );
});
