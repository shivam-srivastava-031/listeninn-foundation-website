import { useState, useRef, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  BookOpen,
  HandHeart,
  Heart,
  MessageSquare,
  ArrowLeft,
  Star,
  ChevronRight,
  Bot,
  User,
  CheckCircle2,
  Loader2,
  Globe,
} from "lucide-react";
import {
  addVolunteer,
  addDonation,
  addFeedback,
  chatWithAI,
  PROGRAMS_INFO,
} from "@/lib/db";
import { recordChatEvent, recordFaqQuery } from "@/lib/trafficStore";
import { onOpenChat, type ChatFlow } from "@/lib/chatBus";

// ━━━━━━━━━━━━━━━━━━━ Types ━━━━━━━━━━━━━━━━━━━

type ChatMode = "menu" | "faq" | "programs" | "volunteer" | "donate" | "feedback";
type VolunteerStep = "name" | "email" | "phone" | "skills" | "resume" | "hours" | "motivation" | "done";
type DonateStep = "amount" | "name" | "email" | "done";
type FeedbackStep = "rating" | "comment" | "done";

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
  timestamp: Date;
}

// ━━━━━━━━━━━━━━━━━━━ Component ━━━━━━━━━━━━━━━━━━━

export function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<ChatMode>("menu");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [language, setLanguage] = useState("English");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Record chat open/close
  const handleToggle = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (next) recordChatEvent("open");
  }, [open]);

  // Record language changes
  const handleLanguageChange = useCallback((lang: string) => {
    setLanguage(lang);
    recordChatEvent(`lang:${lang}`);
  }, []);

  // Volunteer flow state
  const [volStep, setVolStep] = useState<VolunteerStep>("name");
  const [volData, setVolData] = useState({ name: "", email: "", phone: "", skills: "", resume: "", hours: "", motivation: "" });

  // Donate flow state
  const [donStep, setDonStep] = useState<DonateStep>("amount");
  const [donData, setDonData] = useState({ amount: 0, name: "", email: "" });

  // Feedback flow state
  const [fbStep, setFbStep] = useState<FeedbackStep>("rating");
  const [fbData, setFbData] = useState({ rating: 0, comment: "", name: "" });

  const scrollToBottom = useCallback(() => {
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 50);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);
  useEffect(() => { if (open) inputRef.current?.focus(); }, [open, mode]);

  const addMsg = useCallback((from: "bot" | "user", text: string) => {
    setMessages((prev) => [...prev, { id: Date.now().toString() + Math.random(), from, text, timestamp: new Date() }]);
  }, []);

  const botReply = useCallback((text: string, delay = 600) => {
    setIsTyping(true);
    setTimeout(() => { setIsTyping(false); addMsg("bot", text); }, delay);
  }, [addMsg]);

  // ── Mode changers ──

  const goToMenu = () => {
    setMode("menu");
    setMessages([]);
    setVolStep("name"); setVolData({ name: "", email: "", phone: "", skills: "", resume: "", hours: "", motivation: "" });
    setDonStep("amount"); setDonData({ amount: 0, name: "", email: "" });
    setFbStep("rating"); setFbData({ rating: 0, comment: "", name: "" });
  };

  const startFaq = () => {
    setMode("faq");
    recordChatEvent("faq");
    setMessages([]);
    botReply("Hi there! 💜 I'm ListenInn's assistant. Ask me anything about our foundation, programs, volunteering, donations, or mental health support. I'm here to help!", 300);
  };

  const startPrograms = () => {
    setMode("programs");
    recordChatEvent("programs");
    setMessages([]);
    botReply("Here are all the programs we offer at ListenInn Foundation. Tap any program to learn more! 🌟", 300);
  };

  const startVolunteer = () => {
    setMode("volunteer");
    recordChatEvent("volunteer");
    setMessages([]);
    setVolStep("name");
    botReply("Wonderful that you want to volunteer! 🤝 Let's get you started. What's your full name?", 300);
  };

  const startDonate = () => {
    setMode("donate");
    recordChatEvent("donate");
    setMessages([]);
    setDonStep("amount");
    botReply("Thank you for your generosity! 💝 How much would you like to donate? You can choose ₹500, ₹1,000, ₹2,000, ₹5,000, or ₹10,000 — or type any custom amount.", 300);
  };

  const startFeedback = () => {
    setMode("feedback");
    recordChatEvent("feedback");
    setMessages([]);
    setFbStep("rating");
    botReply("We'd love to hear from you! 📝 First, how would you rate your experience with ListenInn? (1-5 stars)", 300);
  };

  // ── Open-chat requests from page buttons (e.g. "Apply to Volunteer") ──
  useEffect(() => {
    const flowStarters: Record<ChatFlow, () => void> = {
      menu: goToMenu,
      faq: startFaq,
      programs: startPrograms,
      volunteer: startVolunteer,
      donate: startDonate,
      feedback: startFeedback,
    };
    return onOpenChat((flow) => {
      setOpen(true);
      recordChatEvent("open");
      flowStarters[flow]?.();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Send handler ──

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    addMsg("user", text);

    if (mode === "faq") {
      setIsTyping(true);
      recordFaqQuery(text); // Record for analytics
      const context = messages.map((m) => `${m.from}: ${m.text}`).join("\n");
      const reply = await chatWithAI(text, context, language);
      setIsTyping(false);
      addMsg("bot", reply);
      return;
    }

    if (mode === "volunteer") { handleVolunteerStep(text); return; }
    if (mode === "donate") { handleDonateStep(text); return; }
    if (mode === "feedback") { handleFeedbackStep(text); return; }
  };

  // ── Volunteer Flow ──

  const handleVolunteerStep = (text: string) => {
    switch (volStep) {
      case "name":
        setVolData((d) => ({ ...d, name: text }));
        setVolStep("email");
        botReply(`Nice to meet you, ${text}! 👋 What's your email address?`);
        break;
      case "email":
        // B6: tightened email validation
        if (!/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(text)) {
          botReply("Hmm, that doesn't look like a valid email. Could you try again? 📧");
          return;
        }
        setVolData((d) => ({ ...d, email: text }));
        setVolStep("phone");
        botReply("Got it! Could you also provide a phone number where we can reach you? 📱");
        break;
      case "phone":
        setVolData((d) => ({ ...d, phone: text }));
        setVolStep("skills");
        botReply("Great! What skills do you bring? (e.g. active listening, empathy, public speaking, writing — separate with commas)");
        break;
      case "skills":
        setVolData((d) => ({ ...d, skills: text }));
        setVolStep("resume");
        botReply("Could you share a link to your resume or LinkedIn profile? 📄 (or type 'skip')");
        break;
      case "resume":
        setVolData((d) => ({ ...d, resume: text === "skip" ? "" : text }));
        setVolStep("hours");
        botReply("How many hours per week can you commit? (e.g. 5, 8, 10)");
        break;
      case "hours":
        setVolData((d) => ({ ...d, hours: text }));
        setVolStep("motivation");
        botReply("Last question — why do you want to volunteer with ListenInn? Share as much or as little as you'd like. 💜");
        break;
      case "motivation": {
        const finalData = { ...volData, motivation: text };
        setVolData(finalData);
        addVolunteer({
          name: finalData.name,
          email: finalData.email,
          phone: finalData.phone,
          resumeLink: finalData.resume,
          skills: finalData.skills.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean),
          availability: `${finalData.hours} hours/week`,
          motivation: finalData.motivation,
        });
        setVolStep("done");
        botReply(`🎉 Thank you so much, ${finalData.name}! Your volunteer application has been submitted successfully. Our team will review your application using our AI screening system and get back to you shortly. Welcome to the ListenInn family! 💜`);
        break;
      }
    }
  };

  // ── Donate Flow ──

  const handleDonateStep = (text: string) => {
    switch (donStep) {
      case "amount": {
        const num = parseInt(text.replace(/[₹,\s]/g, ""), 10);
        if (isNaN(num) || num <= 0) { botReply("Please enter a valid amount (e.g. 500, 2000). 💰"); return; }
        setDonData((d) => ({ ...d, amount: num }));
        setDonStep("name");
        botReply(`₹${num.toLocaleString()} — that's amazing! 🌟 ${num >= 2000 ? "That keeps our helpline running for a full day!" : num >= 500 ? "That funds a free counseling session!" : "Every rupee counts!"} What's your name? (or type "Anonymous")`);
        break;
      }
      case "name":
        setDonData((d) => ({ ...d, name: text }));
        setDonStep("email");
        botReply("And your email for the receipt? (or type 'skip' to remain anonymous)");
        break;
      case "email": {
        const email = text.toLowerCase() === "skip" ? "" : text;
        const finalDon = { ...donData, email };
        setDonData(finalDon);
        addDonation({ name: finalDon.name, email, amount: finalDon.amount });
        setDonStep("done");
        botReply(`🎉✨ Thank you${finalDon.name !== "Anonymous" ? ", " + finalDon.name : ""}! Your donation of ₹${finalDon.amount.toLocaleString()} has been recorded. ${finalDon.amount >= 10000 ? "That funds 10 free counseling sessions!" : finalDon.amount >= 2000 ? "That keeps our helpline running for a full day!" : finalDon.amount >= 500 ? "That funds a free counseling session!" : "Every contribution matters!"} You're making a real difference. 💜`);
        break;
      }
    }
  };

  // ── Feedback Flow ──

  const handleFeedbackStep = (text: string) => {
    switch (fbStep) {
      case "rating": {
        const num = parseInt(text, 10);
        if (isNaN(num) || num < 1 || num > 5) { botReply("Please rate 1 to 5 stars (just type the number). ⭐"); return; }
        setFbData((d) => ({ ...d, rating: num }));
        setFbStep("comment");
        botReply(`${"⭐".repeat(num)} ${num >= 4 ? "Wonderful!" : num >= 3 ? "Thank you!" : "We appreciate your honesty."} Could you share a bit more about your experience? Your words help us improve. 📝`);
        break;
      }
      case "comment":
        setFbData((d) => ({ ...d, comment: text }));
        addFeedback({ name: fbData.name || "Chat User", rating: fbData.rating, comment: text });
        setFbStep("done");
        botReply("Thank you so much for your feedback! 💜 Your words help us serve better. We truly appreciate you taking the time. 🙏");
        break;
    }
  };

  // ── Render ──

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="ai-chat-toggle"
        onClick={handleToggle}
        className={`fixed bottom-6 right-6 z-[9999] flex items-center justify-center rounded-full shadow-lg transition-all duration-300 ${
          open
            ? "h-12 w-12 bg-red-500/90 hover:bg-red-600 text-white rotate-0"
            : "h-14 w-14 bg-gradient-to-br from-[oklch(0.52_0.09_295)] to-[oklch(0.66_0.1_195)] text-white hover:scale-110"
        }`}
        style={!open ? { boxShadow: "0 0 20px rgba(107,91,149,0.4), 0 0 40px rgba(31,163,155,0.2)" } : {}}
        aria-label={open ? "Close chat" : "Open AI assistant"}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Pulsing ring when closed */}
      {!open && (
        <div className="fixed bottom-6 right-6 z-[9998] h-14 w-14 rounded-full animate-ping pointer-events-none" style={{ background: "rgba(107,91,149,0.2)" }} />
      )}

      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[9999] flex flex-col rounded-2xl border border-[oklch(0.9_0.025_295)] bg-[oklch(0.995_0.005_300)] shadow-2xl overflow-hidden"
          style={{
            width: "min(400px, calc(100vw - 48px))",
            height: "min(600px, calc(100vh - 140px))",
            boxShadow: "0 25px 60px -12px rgba(107,91,149,0.3), 0 0 30px rgba(31,163,155,0.1)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 bg-gradient-to-r from-[oklch(0.52_0.09_295)] to-[oklch(0.66_0.1_195)] text-white">
            {mode !== "menu" && (
              <button onClick={goToMenu} className="p-1 rounded-lg hover:bg-white/20 transition-colors" aria-label="Back to menu">
                <ArrowLeft className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div className="flex-shrink-0 h-9 w-9 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate">ListenInn AI Assistant</div>
                <div className="text-[10px] opacity-80 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online · Ready to help
                </div>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center gap-1 flex-shrink-0 bg-white/10 rounded-md px-2 py-1">
              <Globe className="h-3.5 w-3.5 opacity-80" />
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-transparent text-xs text-white border-none focus:outline-none appearance-none cursor-pointer pr-2"
                style={{ textAlignLast: "center" }}
              >
                <option className="text-black" value="English">EN</option>
                <option className="text-black" value="Hindi">HI</option>
                <option className="text-black" value="Bengali">BN</option>
                <option className="text-black" value="Tamil">TA</option>
                <option className="text-black" value="Marathi">MR</option>
              </select>
            </div>
          </div>

          {/* Body */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: "thin" }}>

            {/* ── MAIN MENU ── */}
            {mode === "menu" && (
              <div className="space-y-3">
                <div className="flex gap-2 items-end">
                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[oklch(0.52_0.09_295)] to-[oklch(0.66_0.1_195)] flex items-center justify-center text-white">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-[oklch(0.94_0.02_300)] px-4 py-3 text-sm max-w-[85%] leading-relaxed text-[oklch(0.18_0.04_270)]">
                    Hi there! 👋 I'm ListenInn's AI assistant. How can I help you today?
                  </div>
                </div>
                <div className="grid gap-2 pl-9">
                  {[
                    { icon: MessageSquare, label: "Ask a Question", desc: "About our NGO & services", action: startFaq },
                    { icon: BookOpen, label: "Learn about Programs", desc: "Explore what we offer", action: startPrograms },
                    { icon: HandHeart, label: "Register as Volunteer", desc: "Apply in 2 minutes", action: startVolunteer },
                    { icon: Heart, label: "Make a Donation", desc: "Fund a conversation", action: startDonate },
                    { icon: Star, label: "Give Feedback", desc: "Share your experience", action: startFeedback },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action}
                      className="flex items-center gap-3 rounded-xl border border-[oklch(0.9_0.025_295)] bg-white px-4 py-3 text-left transition-all hover:border-[oklch(0.52_0.09_295)]/30 hover:bg-[oklch(0.97_0.02_300)] hover:shadow-sm group"
                    >
                      <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-gradient-to-br from-[oklch(0.52_0.09_295)]/10 to-[oklch(0.66_0.1_195)]/10 flex items-center justify-center text-[oklch(0.52_0.09_295)] group-hover:from-[oklch(0.52_0.09_295)]/20 group-hover:to-[oklch(0.66_0.1_195)]/20 transition-colors">
                        <item.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-[oklch(0.18_0.04_270)]">{item.label}</div>
                        <div className="text-[11px] text-[oklch(0.45_0.03_285)]">{item.desc}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[oklch(0.45_0.03_285)] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── PROGRAMS MODE ── */}
            {mode === "programs" && (
              <div className="space-y-3">
                {messages.map((m) => (
                  <ChatBubble key={m.id} msg={m} />
                ))}
                <div className="grid gap-2 pl-9">
                  {PROGRAMS_INFO.map((p) => (
                    <button
                      key={p.title}
                      onClick={() => {
                        addMsg("user", p.title);
                        botReply(`${p.icon} **${p.title}**\n\n${p.desc}`, 400);
                      }}
                      className="flex items-center gap-3 rounded-xl border border-[oklch(0.9_0.025_295)] bg-white px-4 py-3 text-left transition-all hover:border-[oklch(0.52_0.09_295)]/30 hover:bg-[oklch(0.97_0.02_300)] hover:shadow-sm"
                    >
                      <span className="text-xl flex-shrink-0">{p.icon}</span>
                      <span className="text-sm font-medium text-[oklch(0.18_0.04_270)]">{p.title}</span>
                      <ChevronRight className="h-4 w-4 text-[oklch(0.45_0.03_285)] ml-auto" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── CONVERSATIONAL MODES (faq, volunteer, donate, feedback) ── */}
            {(mode === "faq" || mode === "volunteer" || mode === "donate" || mode === "feedback") && (
              <div className="space-y-3">
                {messages.map((m) => (
                  <ChatBubble key={m.id} msg={m} />
                ))}

                {/* Done state */}
                {((mode === "volunteer" && volStep === "done") ||
                  (mode === "donate" && donStep === "done") ||
                  (mode === "feedback" && fbStep === "done")) && (
                  <div className="pl-9 pt-2">
                    <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-center space-y-2">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto" />
                      <p className="text-sm font-medium text-green-800">
                        {mode === "volunteer" ? "Application Submitted!" : mode === "donate" ? "Donation Recorded!" : "Feedback Received!"}
                      </p>
                      <button
                        onClick={goToMenu}
                        className="inline-flex items-center gap-1 text-xs text-[oklch(0.52_0.09_295)] hover:underline"
                      >
                        <ArrowLeft className="h-3 w-3" /> Back to menu
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex gap-2 items-end">
                <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gradient-to-br from-[oklch(0.52_0.09_295)] to-[oklch(0.66_0.1_195)] flex items-center justify-center text-white">
                  <Bot className="h-3.5 w-3.5" />
                </div>
                <div className="rounded-2xl rounded-bl-md bg-[oklch(0.94_0.02_300)] px-4 py-3 flex items-center gap-1">
                  <Loader2 className="h-4 w-4 animate-spin text-[oklch(0.52_0.09_295)]" />
                  <span className="text-xs text-[oklch(0.45_0.03_285)]">Thinking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Donate quick amount buttons */}
          {mode === "donate" && donStep === "amount" && (
            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {[500, 1000, 2000, 5000, 10000].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setInput(`₹${amt.toLocaleString()}`);
                    setTimeout(() => {
                      addMsg("user", `₹${amt.toLocaleString()}`);
                      handleDonateStep(amt.toString());
                    }, 0);
                  }}
                  className="rounded-lg border border-[oklch(0.9_0.025_295)] bg-white px-3 py-1.5 text-xs font-medium text-[oklch(0.52_0.09_295)] hover:bg-[oklch(0.97_0.02_300)] transition-colors"
                >
                  ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
          )}

          {/* Feedback star buttons */}
          {mode === "feedback" && fbStep === "rating" && (
            <div className="px-4 pb-2 flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    addMsg("user", `${"⭐".repeat(n)} (${n}/5)`);
                    handleFeedbackStep(n.toString());
                  }}
                  className="flex flex-col items-center gap-0.5 rounded-lg border border-[oklch(0.9_0.025_295)] bg-white px-3 py-2 hover:bg-yellow-50 hover:border-yellow-300 transition-colors"
                >
                  <Star className={`h-5 w-5 ${n <= 3 ? "text-yellow-400" : "text-yellow-500"}`} fill="currentColor" />
                  <span className="text-[10px] text-[oklch(0.45_0.03_285)]">{n}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input bar — shown for conversational modes (not menu, not done states) */}
          {mode !== "menu" && mode !== "programs" &&
           !(mode === "volunteer" && volStep === "done") &&
           !(mode === "donate" && donStep === "done") &&
           !(mode === "feedback" && fbStep === "done") && (
            <div className="border-t border-[oklch(0.9_0.025_295)] bg-white px-4 py-3">
              <form
                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  id="ai-chat-input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  maxLength={500}
                  placeholder={
                    mode === "faq" ? "Ask me anything..." :
                    mode === "volunteer" ? (
                      volStep === "name" ? "Your full name..." :
                      volStep === "email" ? "your@email.com" :
                      volStep === "phone" ? "e.g. +91 98765..." :
                      volStep === "skills" ? "e.g. empathy, listening..." :
                      volStep === "resume" ? "https://linkedin.com/..." :
                      volStep === "hours" ? "e.g. 8" :
                      "Share your motivation..."
                    ) :
                    mode === "donate" ? (
                      donStep === "amount" ? "Amount in ₹" :
                      donStep === "name" ? "Your name..." :
                      "your@email.com"
                    ) :
                    "Type your feedback..."
                  }
                  className="flex-1 rounded-xl border border-[oklch(0.9_0.025_295)] bg-[oklch(0.975_0.012_300)] px-4 py-2.5 text-sm text-[oklch(0.18_0.04_270)] placeholder:text-[oklch(0.45_0.03_285)]/60 focus:outline-none focus:ring-2 focus:ring-[oklch(0.66_0.1_195)]/30 focus:border-[oklch(0.66_0.1_195)]/50 transition-shadow"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isTyping}
                  className="flex-shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-[oklch(0.52_0.09_295)] to-[oklch(0.66_0.1_195)] text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2 bg-[oklch(0.975_0.012_300)] border-t border-[oklch(0.9_0.025_295)] text-center">
            <p className="text-[10px] text-[oklch(0.45_0.03_285)]">
              Powered by ListenInn AI · Not a substitute for professional help · <span className="font-medium">listeninnfoundation@gmail.com</span>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

// ━━━━━━━━━━━━━━━━━━━ Chat Bubble ━━━━━━━━━━━━━━━━━━━

function ChatBubble({ msg }: { msg: ChatMessage }) {
  const isBot = msg.from === "bot";
  return (
    <div className={`flex gap-2 items-end ${isBot ? "" : "flex-row-reverse"}`}>
      <div className={`flex-shrink-0 h-7 w-7 rounded-full flex items-center justify-center ${
        isBot
          ? "bg-gradient-to-br from-[oklch(0.52_0.09_295)] to-[oklch(0.66_0.1_195)] text-white"
          : "bg-[oklch(0.66_0.1_195)]/15 text-[oklch(0.66_0.1_195)]"
      }`}>
        {isBot ? <Bot className="h-3.5 w-3.5" /> : <User className="h-3.5 w-3.5" />}
      </div>
      <div
        className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] leading-relaxed whitespace-pre-line ${
          isBot
            ? "rounded-bl-md bg-[oklch(0.94_0.02_300)] text-[oklch(0.18_0.04_270)]"
            : "rounded-br-md bg-gradient-to-br from-[oklch(0.52_0.09_295)] to-[oklch(0.66_0.1_195)] text-white"
        }`}
      >
        {msg.text}
      </div>
    </div>
  );
}
