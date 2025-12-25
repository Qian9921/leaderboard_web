"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, FileJson, Check } from "lucide-react";
import { LeaderboardType } from "@/lib/types";
import { cn } from "@/lib/utils";

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
      const data = JSON.parse(jsonData);
      
      // Validate required fields
      if (!data.studentId || !data.studentName || !data.githubUsername) {
        throw new Error("Missing required fields: studentId, studentName, githubUsername");
      }
      
      // Add submission date
      data.submissionDate = new Date().toISOString();
      
      // Store in localStorage (temporary for static site)
      const storageKey = `leaderboard_${leaderboardType}`;
      const existing = localStorage.getItem(storageKey);
      const existingData = existing ? JSON.parse(existing) : [];
      
      // Check if student already submitted
      const existingIndex = existingData.findIndex(
        (entry: any) => entry.studentId === data.studentId
      );
      
      if (existingIndex >= 0) {
        existingData[existingIndex] = data;
      } else {
        existingData.push(data);
      }
      
      localStorage.setItem(storageKey, JSON.stringify(existingData));
      
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
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-blue-600">
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
                  placeholder={`{\n  "studentId": "20240001",\n  "studentName": "张三",\n  "githubUsername": "zhangsan",\n  ...\n}`}
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
                    ❌ {errorMessage}
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
                    ✅ Upload successful!
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
                  "bg-gradient-to-r from-purple-600 to-blue-600",
                  "hover:from-purple-700 hover:to-blue-700",
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

