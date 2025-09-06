import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Bot, User, CheckCircle, Send } from "lucide-react";
import ExcelGrid from "../components/ExcelGrid";

interface Message {
  id: string;
  text: string;
  sender: "interviewer" | "candidate";
  timestamp: Date;
}

const Interview = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [textAnswer, setTextAnswer] = useState(""); // new text input
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startInterview = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/interview/start");
      setMessages([
        {
          id: Date.now().toString(),
          text: res.data.message,
          sender: "interviewer",
          timestamp: new Date(),
        },
      ]);
      setStarted(true);
    } catch (err) {
      console.error("Error starting interview", err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAnswer = async () => {
    let answer = "";

    // If text answer is provided, prefer it
    if (textAnswer.trim()) {
      answer = textAnswer.trim();
      setTextAnswer("");
    } else if (gridRef.current) {
      // Otherwise, take Excel cell answer (C2 for example)
      const hot = gridRef.current.hotInstance;
      answer = hot.getDataAtCell(1, 2); // Row 2, Col C
    }

    if (!answer) {
      alert("Please type your answer or enter it in the Excel grid.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: answer,
      sender: "candidate",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/interview/validate",
        { answer }
      );

      // Check if Gemini returned final JSON report
      if (res.data.message.includes('"status": "completed"')) {
        const jsonMatch = res.data.message.match(/\{.*\}/s);
        if (jsonMatch) {
          const reportJson = JSON.parse(jsonMatch[0]);
          localStorage.setItem("reportData", JSON.stringify(reportJson));
          window.location.href = "/reports";
          return;
        }
      }

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: res.data.message,
        sender: "interviewer",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Error validating answer", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden h-[calc(100vh-100px)] flex flex-col"
        >
          {/* Header */}
          <div className="bg-green-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">
              Excel Interview Session
            </h1>
            <p className="text-green-100 mt-1">
              Practice with our AI interviewer (Gemini)
            </p>
          </div>

          {/* Main */}
          <div className="flex flex-1 flex-col lg:flex-row">
            {/* Chat Section */}
            <div className="lg:w-1/2 flex flex-col border-r border-gray-200">
              {/* Messages (scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${
                      message.sender === "candidate"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                        message.sender === "candidate"
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      <div
                        className={`p-2 rounded-full ${
                          message.sender === "interviewer"
                            ? "bg-green-100 text-green-600"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {message.sender === "interviewer" ? (
                          <Bot className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.sender === "candidate"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="bg-green-100 text-green-600 p-2 rounded-full">
                        <Bot className="w-4 h-4" />
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="p-4 border-t border-gray-200 bg-white space-y-2">
                {!started ? (
                  <button
                    onClick={startInterview}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Start Interview
                  </button>
                ) : (
                  <>
                    {/* Text input for theoretical answers */}
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={textAnswer}
                        onChange={(e) => setTextAnswer(e.target.value)}
                        placeholder="Type your answer here..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        disabled={isLoading}
                      />
                      <button
                        onClick={validateAnswer}
                        disabled={isLoading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Or validate from Excel grid */}
                    <button
                      onClick={validateAnswer}
                      disabled={isLoading}
                      className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <CheckCircle className="w-4 h-4 inline mr-2" />
                      Validate from Excel
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Excel Grid Section */}
            <div className="lg:w-1/2 p-6 overflow-y-auto">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Excel Workspace
              </h2>
              <div className="max-h-[calc(100vh-250px)] overflow-y-auto">
                <ExcelGrid ref={gridRef} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Interview;
