import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Send, Bot, User, CheckCircle } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "interviewer" | "candidate";
  timestamp: Date;
  image_url?: string; // optional image
}

const Interview = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
          image_url: res.data.image_url,
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
    if (!currentAnswer.trim()) {
      alert("Please type your answer first.");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: currentAnswer,
      sender: "candidate",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setCurrentAnswer("");

    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://127.0.0.1:8000/api/interview/validate",
        { answer: userMessage.text }
      );

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
        image_url: res.data.image_url,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error("Error validating answer", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      validateAnswer();
    }
  };

  const renderMessageText = (text: string) => {
    return text.split("\n").map((line, index) => {
      if (line.startsWith("#")) {
        return (
          <h3 key={index} className="text-lg font-bold mb-1">
            {line.replace(/^#+\s*/, "")}
          </h3>
        );
      }
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="text-sm whitespace-pre-line mb-1">
          {parts.map((part, i) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={i}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div className="h-screen w-screen bg-gray-50 flex flex-col">
      {!started ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center justify-center flex-1 p-8 text-center"
        >
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          >
            👋 Hey there, I’m <span className="text-green-600">Excellerate</span>
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-gray-600 max-w-xl mb-8"
          >
            I’ll be your **AI Interviewer** today. Ready to test your skills and see how you perform? 🚀
          </motion.p>
          <motion.button
            onClick={startInterview}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
          >
            Start Interview
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col flex-1"
        >
          {/* Chat Section */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${
                  message.sender === "candidate" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start max-w-full ${
                    message.sender === "candidate"
                      ? "flex-row-reverse space-x-reverse"
                      : "flex-row space-x-4"
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
                    className={`px-4 py-2 rounded-2xl flex items-start space-x-4 ${
                      message.sender === "candidate"
                        ? "bg-blue-600 text-white flex-row-reverse space-x-reverse"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {renderMessageText(message.text)}
                    </div>
                    {message.image_url && (
                      <div className="flex-1">
                        <img
                          src={`http://127.0.0.1:8000${message.image_url}`}
                          alt="Interview visual"
                          className="max-w-[110%] md:max-w-[800px] max-h-[500px] w-auto h-auto object-contain rounded-lg border border-gray-300"
                        />
                      </div>
                    )}
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

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 flex space-x-2">
            <input
              type="text"
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your response..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              onClick={validateAnswer}
              disabled={isLoading || !currentAnswer.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <CheckCircle className="w-4 h-4 inline mr-2" />
              Validate Answer
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Interview;
