"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

// Type definitions for API response
interface AnalysisResult {
  result: {
    primary_mood: string;
    intensity: number;
    positivity_level: number;
    topic_reason: string;
    reflection_message: string;
    suggestion: string;
    keywords: string[];
    safety_note: string;
  };
  raw_model_output?: string;
  error?: string;
}

const MOOD_OPTIONS = [
  { value: "Angry", emoji: "😠", label: "Angry" },
  { value: "Happiness", emoji: "😊", label: "Happiness" },
  { value: "Love", emoji: "❤️", label: "Love" },
  { value: "Sad", emoji: "😢", label: "Sad" },
  { value: "Disgust", emoji: "🤢", label: "Disgust" },
  { value: "Fear", emoji: "😨", label: "Fear" },
] as const;

const INTENSITY_LABELS = [
  { min: 0, max: 2, label: "A Little Bit" },
  { min: 3, max: 4, label: "Somewhat" },
  { min: 5, max: 6, label: "Quite a Bit" },
  { min: 7, max: 8, label: "A Lot" },
  { min: 9, max: 10, label: "Overwhelming" },
] as const;

interface ParsedAnalysis {
  mood: string;
  suggestion: string;
  emotionalReflection: string;
  keywords: string;
  intensity: string;
  positivityLevel: string;
  topicReason: string;
  safetyNote: string;
}

export default function Home() {
  const [diaryText, setDiaryText] = useState("");
  const [selectedMood, setSelectedMood] = useState<(typeof MOOD_OPTIONS)[number]["value"]>("Sad");
  const [intensityScore, setIntensityScore] = useState(5);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ParsedAnalysis | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const getIntensityLabel = (score: number): string => {
    const match = INTENSITY_LABELS.find(
      (item) => score >= item.min && score <= item.max
    );
    return match?.label ?? "not provided";
  };

  const parseResult = (result: AnalysisResult["result"]): ParsedAnalysis => ({
    mood: result.primary_mood,
    suggestion: result.suggestion,
    emotionalReflection: result.reflection_message,
    keywords: Array.isArray(result.keywords) ? result.keywords.join(", ") : "",
    intensity: String(result.intensity),
    positivityLevel: String(result.positivity_level),
    topicReason: result.topic_reason,
    safetyNote: result.safety_note,
  });

  // Get emoji for mood
  const getMoodEmoji = (mood: string): string => {
    const moodMap: { [key: string]: string } = {
      angry: "😠",
      happiness: "😊",
      love: "❤️",
      sad: "😢",
      disgust: "🤢",
      fear: "😨",
      sadness: "😢",
      joy: "😄",
      anger: "😠",
      surprise: "😲",
      neutral: "😐",
    };
    return moodMap[mood.toLowerCase()] || "🤔";
  };

  const selectedIntensityLabel = getIntensityLabel(intensityScore);

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!diaryText.trim()) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: diaryText,
          mood: selectedMood,
          mood_intensity: intensityScore,
        }),
      });

      const data: AnalysisResult = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to analyze diary entry");
      }

      if (!data.result || typeof data.result !== "object") {
        throw new Error("Invalid AI response format");
      }

      const parsed = parseResult(data.result);
      setAnalysis(parsed);
      setErrorMessage("");
    } catch (error) {
      console.error("Error analyzing diary:", error);
      setAnalysis(null);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Failed to analyze diary entry"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5e6d3] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Title */}
        <h1 className="font-pixel text-2xl md:text-3xl text-center text-black pixel-shadow-sm bg-white border-4 border-black p-4">
          WRITE IN DIARY
        </h1>

        {/* Level Bar */}
        <Card className="border-4 border-black pixel-shadow bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <span className="font-pixel text-sm md:text-base text-black whitespace-nowrap">
              LV 3
            </span>
            <div className="flex-1 h-8 border-4 border-black bg-gray-300 relative">
              <div
                className="h-full bg-linear-to-r from-blue-400 to-blue-600"
                style={{ width: "65%" }}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-pixel text-xs text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                    65/100 XP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="border-4 border-black pixel-shadow bg-white p-6 space-y-5">
          <div className="space-y-2">
            <p className="font-pixel text-xs md:text-sm text-black">
              PICK YOUR MOOD
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {MOOD_OPTIONS.map((mood) => {
                const isActive = selectedMood === mood.value;
                return (
                  <button
                    key={mood.value}
                    type="button"
                    onClick={() => setSelectedMood(mood.value)}
                    className={`flex items-center gap-3 border-4 border-black px-4 py-3 text-left transition-all ${
                      isActive
                        ? "bg-[#4a90e2] text-white translate-x-0.5 translate-y-0.5 shadow-[2px_2px_0px_0px_black]"
                        : "bg-[#f8f4ed] hover:bg-[#f0e5d7]"
                    }`}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="font-pixel text-sm">{mood.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="font-pixel text-xs md:text-sm text-black">
                INTENSITY SCORE
              </p>
              <div className="text-right">
                <p className="font-pixel text-xs text-black">{intensityScore} / 10</p>
                <p className="text-xs text-gray-600">{selectedIntensityLabel}</p>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="1"
              value={intensityScore}
              onChange={(e) => setIntensityScore(Number(e.target.value))}
              className="w-full accent-[#4a90e2]"
            />
            <div className="flex justify-between text-[10px] md:text-xs font-pixel text-gray-600">
              <span>LOW</span>
              <span>HIGH</span>
            </div>
          </div>
        </Card>

        {/* Diary Input Area */}
        <Card className="border-4 border-black pixel-shadow bg-white p-6">
          <Textarea
            value={diaryText}
            onChange={(e) => setDiaryText(e.target.value)}
            placeholder="Write your diary entry here..."
            className="min-h-[200px] border-4 border-black text-base md:text-lg resize-none focus-visible:ring-0 focus-visible:ring-offset-0 font-mono"
          />
        </Card>

        {/* Analyze Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleAnalyze}
            disabled={loading || !diaryText.trim()}
            className="font-pixel text-sm md:text-base bg-[#4a90e2] hover:bg-[#357abd] text-white border-4 border-black pixel-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_black] transition-all disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6"
          >
            {loading ? "ANALYZING..." : "ANALYZE WITH AI"}
          </Button>
        </div>

        {errorMessage && (
          <Card className="border-4 border-black pixel-shadow bg-[#ffe3e3] p-4 text-black">
            <p className="font-pixel text-xs md:text-sm mb-1">ANALYSIS ERROR</p>
            <p className="text-sm md:text-base">{errorMessage}</p>
          </Card>
        )}

        {/* Analysis Results Panel */}
        {analysis && (
          <Card className="border-4 border-black pixel-shadow bg-[#2b3b46] p-6 text-white">
            <div className="space-y-4">
              {/* Panel Title */}
              <div className="border-b-4 border-white pb-3">
                <h2 className="font-pixel text-lg md:text-xl text-center">
                  ★ ANALYSIS RESULTS ★
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-2">INPUT MOOD</p>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getMoodEmoji(selectedMood)}</span>
                    <p className="font-pixel text-sm md:text-base text-white">{selectedMood}</p>
                  </div>
                </div>

                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-2">INPUT INTENSITY</p>
                  <p className="font-pixel text-sm md:text-base text-white">{selectedIntensityLabel}</p>
                  <p className="text-xs text-gray-300 mt-1">Score {intensityScore} / 10</p>
                </div>
              </div>

              {/* Mood Section */}
              <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getMoodEmoji(analysis.mood)}</span>
                  <div>
                    <p className="font-pixel text-xs text-gray-300">MOOD</p>
                    <p className="font-pixel text-sm md:text-base text-white capitalize">
                      {analysis.mood}
                    </p>
                  </div>
                </div>
              </div>

              {/* Suggestion Section */}
              {analysis.suggestion && (
                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-2">
                    SUGGESTION
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">
                    {analysis.suggestion}
                  </p>
                </div>
              )}

              {/* Emotional Reflection Section */}
              {analysis.emotionalReflection && (
                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-2">
                    EMOTIONAL REFLECTION
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">
                    {analysis.emotionalReflection}
                  </p>
                </div>
              )}

              {/* Keywords Section */}
              {analysis.keywords && (
                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-2">
                    KEYWORDS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {analysis.keywords.split(",").map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-[#4a90e2] border-2 border-white px-3 py-1 text-xs md:text-sm font-pixel"
                      >
                        {keyword.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Sentiment Score Section */}
              {analysis.topicReason && (
                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-2">
                    TOPIC REASON
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">
                    {analysis.topicReason}
                  </p>
                </div>
              )}

              {analysis.safetyNote && (
                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-2">
                    SAFETY NOTE
                  </p>
                  <p className="text-sm md:text-base leading-relaxed">
                    {analysis.safetyNote}
                  </p>
                </div>
              )}

              {(analysis.intensity || analysis.positivityLevel) && (
                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-3">
                    AI METRICS
                  </p>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-xs text-gray-300 mb-1">INTENSITY</p>
                      <p className="font-pixel text-sm text-white">{analysis.intensity} / 10</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-300 mb-1">POSITIVITY LEVEL</p>
                      <p className="font-pixel text-sm text-white">{analysis.positivityLevel} / 10</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
