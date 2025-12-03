"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

// Type definitions for API response
interface AnalysisResult {
  emotion: string;
  advice: string;
}

interface ParsedAnalysis {
  mood: string;
  suggestion: string;
  emotionalReflection: string;
  keywords: string;
  sentimentScore: string;
}

export default function Home() {
  const [diaryText, setDiaryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ParsedAnalysis | null>(null);

  // Parse the advice string from API response
  const parseAdvice = (advice: string, emotion: string): ParsedAnalysis => {
    const lines = advice.split("\n");
    const result: ParsedAnalysis = {
      mood: emotion,
      suggestion: "",
      emotionalReflection: "",
      keywords: "",
      sentimentScore: "",
    };

    lines.forEach((line) => {
      if (line.includes("Suggestion:")) {
        result.suggestion = line.replace("- Suggestion:", "").trim();
      } else if (line.includes("Emotional Reflection:")) {
        result.emotionalReflection = line
          .replace("- Emotional Reflection:", "")
          .trim();
      } else if (line.includes("Keywords:")) {
        result.keywords = line.replace("- Keywords:", "").trim();
      } else if (line.includes("Sentiment Score:")) {
        result.sentimentScore = line.replace("- Sentiment Score:", "").trim();
      }
    });

    return result;
  };

  // Get emoji for mood
  const getMoodEmoji = (mood: string): string => {
    const moodMap: { [key: string]: string } = {
      sadness: "😢",
      joy: "😄",
      happiness: "😊",
      anger: "😠",
      fear: "😨",
      surprise: "😲",
      neutral: "😐",
    };
    return moodMap[mood.toLowerCase()] || "🤔";
  };

  // Handle analyze button click
  const handleAnalyze = async () => {
    if (!diaryText.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: diaryText }),
      });

      const data: AnalysisResult = await response.json();
      const parsed = parseAdvice(data.advice, data.emotion);
      setAnalysis(parsed);
    } catch (error) {
      console.error("Error analyzing diary:", error);
      // Use mock data if API fails
      const mockData: AnalysisResult = {
        emotion: "sadness",
        advice:
          "- Suggestion: Take breaks between study sessions and celebrate small wins\n- Emotional Reflection: Feeling overwhelmed by multiple deadlines is normal, acknowledge your effort\n- Mood: sadness\n- Keywords: app, UI, UX, remake, final exam\n- Sentiment Score: 3\n",
      };
      const parsed = parseAdvice(mockData.advice, mockData.emotion);
      setAnalysis(parsed);
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
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
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
            className="font-pixel text-sm md:text-base bg-[#4a90e2] hover:bg-[#357abd] text-white border-4 border-black pixel-shadow hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_black] transition-all disabled:opacity-50 disabled:cursor-not-allowed px-8 py-6"
          >
            {loading ? "ANALYZING..." : "ANALYZE WITH AI"}
          </Button>
        </div>

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
              {analysis.sentimentScore && (
                <div className="bg-[#1a2633] border-4 border-white p-4 pixel-shadow-sm">
                  <p className="font-pixel text-xs text-gray-300 mb-3">
                    SENTIMENT SCORE
                  </p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                      <div
                        key={level}
                        className={`w-12 h-12 border-4 border-white ${
                          level <= parseInt(analysis.sentimentScore)
                            ? "bg-[#4a90e2]"
                            : "bg-gray-600"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-300 mt-2">
                    {analysis.sentimentScore} / 10
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
