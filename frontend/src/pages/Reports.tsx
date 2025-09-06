import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Award, BookOpen, RotateCcw } from "lucide-react";

interface SkillData {
  name: string;
  proficiency: number;
  icon: React.ReactNode;
  color: string;
}

interface ReportData {
  overallScore: number;
  skills: SkillData[];
  roadmap: string[];
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("reportData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);

        // Extract skills as array
        let skills: SkillData[] = [];
        if (parsed.skills && typeof parsed.skills === "object") {
          const icons = [<Target className="w-6 h-6" />, <TrendingUp className="w-6 h-6" />, <Award className="w-6 h-6" />, <BookOpen className="w-6 h-6" />];
          const colors = ["green", "blue", "purple", "orange"];
          let i = 0;
          skills = Object.entries(parsed.skills).map(([name, proficiency]) => {
            const skill: SkillData = {
              name,
              proficiency: Number(proficiency),
              icon: icons[i % icons.length],
              color: colors[i % colors.length],
            };
            i++;
            return skill;
          });
        }

        // Compute overall score as average
        const overallScore =
          skills.length > 0
            ? Math.round(
                skills.reduce((sum, s) => sum + s.proficiency, 0) / skills.length
              )
            : 0;

        const roadmap: string[] = parsed.roadmap || [];

        setReportData({
          overallScore,
          skills,
          roadmap,
        });
      } catch (err) {
        console.error("Error parsing report data", err);
      }
    }
  }, []);

  if (!reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No report data available. Please complete the interview first.</p>
          <button
            onClick={() => (window.location.href = "/interview")}
            className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Interview
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Performance Report</h1>

          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm p-8 mb-8"
          >
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Overall Score</h2>
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="2"
                  />
                  <path
                    d="m18,2.0845 a 15.9155,15.9155 0 0,1 0,31.831 a 15.9155,15.9155 0 0,1 0,-31.831"
                    fill="none"
                    stroke="#16a34a"
                    strokeWidth="2"
                    strokeDasharray={`${reportData.overallScore}, 100`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold text-gray-900">
                    {reportData.overallScore}%
                  </span>
                </div>
              </div>
              <p className="text-gray-600">
                {reportData.overallScore >= 75
                  ? "Excellent work! You're interview-ready."
                  : "Good effort! Focus on the roadmap to improve further."}
              </p>
            </div>
          </motion.div>

          {/* Skills Breakdown */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {reportData.skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm p-6"
              >
                <div className={`text-${skill.color}-600 mb-4`}>{skill.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{skill.name}</h3>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                    className={`bg-${skill.color}-600 h-2 rounded-full`}
                  />
                </div>
                <p className="text-sm text-gray-600">{skill.proficiency}% proficiency</p>
              </motion.div>
            ))}
          </div>

          {/* Personalized Roadmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-white rounded-2xl shadow-sm p-8"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personalized Roadmap</h2>
            <div className="space-y-4">
              {reportData.roadmap.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 1 }}
                  className="flex items-start space-x-3"
                >
                  <div className="bg-green-100 text-green-600 rounded-full p-1 mt-1">
                    <div className="w-2 h-2 bg-current rounded-full"></div>
                  </div>
                  <p className="text-gray-700 flex-1">{item}</p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => (window.location.href = "/interview")}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retake Interview</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Reports;
