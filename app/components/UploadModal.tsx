"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileJson, Check } from "lucide-react";
import { LeaderboardType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { leaderboardConfigs } from "@/lib/leaderboard-config";
import { getSupabaseClient } from "@/lib/supabase";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leaderboardType: LeaderboardType;
  onUploadSuccess: () => void;
}

export default function UploadModal({
  isOpen,
  onClose,
  leaderboardType,
  onUploadSuccess,
}: UploadModalProps) {
  const [jsonData, setJsonData] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async () => {
    setIsUploading(true);
    setUploadStatus("idle");
    setErrorMessage("");

    try {
      const data = parseAndValidateSubmission(jsonData, leaderboardType);
      
      await upsertSubmissionToSupabase(leaderboardType, data);

      
      
      setUploadStatus("success");
      setTimeout(() => {
        onUploadSuccess();
        onClose();
        setJsonData("");
        setUploadStatus("idle");
      }, 1500);
    } catch (error) {
      setUploadStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Invalid JSON format"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-violet-600 to-sky-600">
              <div className="flex items-center gap-3">
                <FileJson className="text-white" size={24} />
                <h2 className="text-2xl font-bold text-white">Upload Submission</h2>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Leaderboard Type
                </label>
                <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg font-mono">
                  {leaderboardType}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  JSON Data
                </label>
                <textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  placeholder={`{\n  \"group_name\": \"Team Alpha\",\n  \"project_private_repo_url\": \"https://github.com/yourusername/project.git\",\n  \"metrics\": {\n    \"miou\": 72.73,\n    \"dice_score\": 39.80,\n    \"fwiou\": 88.85\n  }\n}`}
                  className={cn(
                    "w-full h-64 px-4 py-3 font-mono text-sm rounded-lg border-2 transition-colors",
                    "bg-gray-50 dark:bg-gray-800",
                    "border-gray-300 dark:border-gray-600",
                    "focus:border-blue-500 dark:focus:border-blue-400",
                    "focus:outline-none",
                    uploadStatus === "error" && "border-red-500"
                  )}
                />
              </div>

              {uploadStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                >
                  <p className="text-red-600 dark:text-red-400 text-sm">
                    Error: {errorMessage}
                  </p>
                </motion.div>
              )}

              {uploadStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
                >
                  <Check className="text-green-600 dark:text-green-400" size={20} />
                  <p className="text-green-600 dark:text-green-400 text-sm font-semibold">
                    Upload successful!
                  </p>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={isUploading || !jsonData.trim()}
                className={cn(
                  "flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all",
                  "bg-gradient-to-r from-violet-600 to-sky-600",
                  "hover:from-violet-700 hover:to-sky-700",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  "flex items-center justify-center gap-2"
                )}
              >
                {isUploading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Upload size={20} />
                    </motion.div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Data
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


async function upsertSubmissionToSupabase(leaderboardType: LeaderboardType, submission: any) {
  const supabase = getSupabaseClient();
  const config = leaderboardConfigs[leaderboardType];

  const metrics: Record<string, number> = {};
  for (const metric of config.metrics) {
    metrics[metric.key] = submission.metrics[metric.key];
  }

  const payload = {
    leaderboard_type: leaderboardType,
    group_name: submission.groupName,
    project_private_repo_url: submission.projectPrivateRepoUrl,
    github_username: submission.githubUsername ?? null,
    metrics,
  };

  const { error } = await supabase
    .from("submissions")
    .upsert(payload, { onConflict: "leaderboard_type,group_name" });

  if (error) {
    throw error;
  }
}

function parseAndValidateSubmission(jsonString: string, leaderboardType: LeaderboardType) {
  // Parse JSON and enforce a single-entry object (not an array)
  const data = JSON.parse(jsonString);

  if (Array.isArray(data)) {
    throw new Error("Please upload a single JSON object, not an array.");
  }

  const groupName = data?.group_name ?? data?.groupName;
  const projectPrivateRepoUrl = data?.project_private_repo_url ?? data?.projectPrivateRepoUrl;
  const githubUsername = data?.github_username ?? data?.githubUsername;
  const metrics = data?.metrics;

  // Validate required identity fields
  if (!groupName || !projectPrivateRepoUrl) {
    throw new Error("Missing required fields: group_name, project_private_repo_url");
  }

  if (typeof groupName !== "string") {
    throw new Error("group_name must be a string.");
  }

  if (typeof projectPrivateRepoUrl !== "string") {
    throw new Error("project_private_repo_url must be a string.");
  }

  if (githubUsername !== undefined && typeof githubUsername !== "string") {
    throw new Error("github_username must be a string if provided.");
  }

  // Validate metrics for the selected leaderboard
  const config = leaderboardConfigs[leaderboardType];
  if (!metrics || typeof metrics !== "object") {
    throw new Error("metrics must be an object.");
  }

  for (const metric of config.metrics) {
    const value = metrics[metric.key];
    if (typeof value !== "number" || Number.isNaN(value)) {
      throw new Error(`Invalid metric: "${metric.key}" must be a number.`);
    }
  }

  return {
    groupName,
    projectPrivateRepoUrl,
    githubUsername,
    metrics,
  };
}
