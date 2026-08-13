import React, { useState } from "react";
import { Mail, Clock, HelpCircle, ChevronRight, ChevronDown, CheckCircle2, MessageSquare } from "lucide-react";
import { trackGenerateLead } from "../utils/analytics";
import { motion } from "motion/react";

interface ContactViewProps {
  theme: "dark" | "light";
}

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: "How do I apply the SHOPWEEK15 discount code?",
    a: "Simply add items to your cart, navigate to the cart page, enter 'SHOPWEEK15' in the Promo Coupon field, and press Apply. This reduces prices sitewide by 15%, overrides standard shipping limits to grant Free Shipping, and locks the promotion into your secure Checkout session."
  },
  {
    q: "Do you ship to India? What are the standard delivery timelines?",
    a: "Yes! Our newly integrated India Hub operates directly out of Bengaluru and Hyderabad logistics centers. Standard shipping to all major Indian cities takes 3-5 business days. Best of all, all custom duties, import taxes, and logistics clearance costs are fully prepaid at dispatch, guaranteeing hassle-free courier delivery."
  },
  {
    q: "What is your standard return policy?",
    a: "We offer a 30-day, zero-hassle return policy on all unworn apparel, sealed tech accessories, stickers, and un-fired ceramic drinkware. Simply enter your order number and contact email in our Support center to generate an instant prepaid local return label."
  },
  {
    q: "Are these products official Google merchandise?",
    a: "Absolutely. All items listed are certified, authentic Google-branded merchandise, produced sustainably in partnership with official Google Campus channels. The website redesign is an authorized design study inspired by the modern aesthetic of Google AI Studio."
  }
];

export const ContactView: React.FC<ContactViewProps> = ({ theme }) => {
  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [orderNum, setOrderNum] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion State
  const [openFAQIdx, setOpenFAQIdx] = useState<number | null>(0);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Fire lead generation GA4 telemetry
    trackGenerateLead("Contact Support Form", email);

    // Show success dialog
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setOrderNum("");
    setMessage("");
    setIsSubmitted(false);
  };

  const toggleFAQ = (idx: number) => {
    setOpenFAQIdx((prev) => (prev === idx ? null : idx));
  };

  const isDark = theme === "dark";

  return (
    <div className={`transition-colors duration-300 min-h-screen py-12 ${isDark ? "bg-ai-bg text-ai-text" : "bg-zinc-50 text-zinc-900"}`} id="contact-view">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-xl mx-auto mb-16"
          id="contact-header"
        >
          <span className="text-xs font-mono font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
            Contact Support & Help Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading mt-3 mb-2">Connect with our Team</h1>
          <p className={`text-sm ${isDark ? "text-ai-muted" : "text-zinc-500"}`}>
            Got questions about sizes, order delivery, or the Smart Shopping Week campaign? Reach our global team in Mountain View or Bengaluru.
          </p>
        </motion.div>

        {/* Contact layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16" id="contact-layout-grid">
          
          {/* LEFT COLUMN: FAQ Accordions (lg:col-span-7) */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
            id="contact-faq-section"
          >
            <div className="flex items-center gap-2 mb-6" id="faq-section-title">
              <HelpCircle className="h-5 w-5 text-purple-400" />
              <h2 className="text-xl sm:text-2xl font-bold font-heading">Frequently Asked Questions</h2>
            </div>

            <div className="flex flex-col gap-4" id="faq-items-list">
              {FAQS.map((faq, idx) => {
                const isOpen = openFAQIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all ${
                      isOpen
                        ? isDark
                          ? "bg-ai-surface border-purple-500/35 shadow-md"
                          : "bg-white border-purple-500/35 shadow-sm"
                        : isDark
                        ? "bg-ai-surface/60 border-ai-border"
                        : "bg-white border-zinc-200"
                    }`}
                    id={`faq-accordion-item-${idx}`}
                  >
                    <button
                      onClick={() => toggleFAQ(idx)}
                      className="w-full text-left py-4 px-5 flex items-center justify-between gap-3 font-heading font-bold text-sm sm:text-base cursor-pointer"
                      id={`faq-btn-${idx}`}
                    >
                      <span className={isOpen ? "text-purple-400" : ""}>{faq.q}</span>
                      {isOpen ? <ChevronDown className="h-4 w-4 text-purple-400" /> : <ChevronRight className="h-4 w-4 text-zinc-500" />}
                    </button>
                    {isOpen && (
                      <div className={`px-5 pb-5 pt-1 text-xs sm:text-sm leading-relaxed opacity-85 ${isDark ? "text-zinc-300" : "text-zinc-600"}`} id={`faq-answer-${idx}`}>
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>

          {/* RIGHT COLUMN: Contact Support Form (lg:col-span-5) */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
            id="contact-form-section"
          >
            {isSubmitted ? (
              /* Success confirmation block */
              <div
                className={`p-8 rounded-2xl border text-center flex flex-col items-center justify-center h-full min-h-[350px] ${
                  isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"
                }`}
                id="contact-form-success"
              >
                <div className="p-3.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4 animate-bounce-slow">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-bold font-heading mb-2 text-white dark:text-white">Message Dispatched!</h3>
                <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${isDark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Your query has been logged and forwarded. Our support queue averages a 15-minute response sprint for current orders.
                </p>
                <button
                  onClick={resetForm}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold py-2.5 px-6 rounded-lg transition-colors cursor-pointer"
                  id="reset-contact-form-btn"
                >
                  Send another message
                </button>
              </div>
            ) : (
              /* Contact Form */
              <div
                className={`p-6 sm:p-8 rounded-2xl border ${
                  isDark ? "bg-ai-surface border-ai-border" : "bg-white border-zinc-200"
                }`}
                id="contact-form-card"
              >
                <div className="flex items-center gap-2 mb-6" id="form-card-title">
                  <MessageSquare className="h-4.5 w-4.5 text-blue-400" />
                  <h3 className="font-heading font-bold text-base">Direct Message Support Queue</h3>
                </div>

                <form onSubmit={handleContactSubmit} className="flex flex-col gap-4" id="direct-support-form">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Elena Jenkins"
                      className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                        isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                      }`}
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. developer@gmail.com"
                      className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                        isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                      }`}
                    />
                  </div>

                  {/* Order reference number */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">Order ID / SKU (Optional)</label>
                    <input
                      type="text"
                      value={orderNum}
                      onChange={(e) => setOrderNum(e.target.value)}
                      placeholder="e.g. T-128954"
                      className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                        isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                      }`}
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs font-semibold text-zinc-400 block mb-1">How can we help? *</label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Describe your inquiry details..."
                      className={`w-full text-sm px-3.5 py-2.5 rounded-lg border focus:outline-hidden focus:ring-1 focus:ring-purple-500 ${
                        isDark ? "bg-zinc-900 border-zinc-800 text-white" : "bg-white border-zinc-300 text-zinc-900"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full text-sm font-bold text-white bg-linear-to-r from-blue-500 via-purple-500 to-rose-500 hover:opacity-95 transition-opacity py-3 px-6 rounded-xl shadow-lg mt-2 cursor-pointer"
                    id="contact-form-submit-btn"
                  >
                    Submit Support Ticket
                  </button>
                </form>
              </div>
            )}
          </motion.section>

        </div>

        {/* Global support nodes (Hours and Locations) */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 sm:p-8 rounded-2xl border ${
            isDark ? "bg-ai-surface/40 border-ai-border text-zinc-300" : "bg-white border-zinc-200 text-zinc-700"
          }`}
          id="global-support-nodes"
        >
          
          <div className="flex items-start gap-3.5" id="support-node-hours">
            <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 flex-shrink-0 mt-0.5">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h4 className={`text-sm font-bold font-heading mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Support Timings</h4>
              <p className="text-xs leading-relaxed">US: Monday–Friday 9:00 AM–5:00 PM PST</p>
              <p className="text-xs leading-relaxed mt-0.5">India: Monday–Friday 9:00 AM–6:00 PM IST</p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 border-t sm:border-t-0 sm:border-l sm:pl-6 border-zinc-800/15 dark:border-zinc-800 pt-6 sm:pt-0" id="support-node-email">
            <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 flex-shrink-0 mt-0.5">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h4 className={`text-sm font-bold font-heading mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Email Channels</h4>
              <a href="mailto:support@googlemerchstore.com" className="text-xs hover:text-blue-400 transition-colors block">
                support@googlemerchstore.com
              </a>
              <span className="text-[10px] text-zinc-500 font-mono mt-1 block">Response target: Under 1 hour</span>
            </div>
          </div>

          <div className="flex items-start gap-3.5 border-t lg:border-t-0 lg:border-l lg:pl-6 border-zinc-800/15 dark:border-zinc-800 pt-6 lg:pt-0 col-span-1 sm:col-span-2 lg:col-span-1" id="support-node-locations">
            <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 flex-shrink-0 mt-0.5">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className={`text-sm font-bold font-heading mb-1 ${isDark ? "text-white" : "text-zinc-900"}`}>Logistics Hubs</h4>
              <p className="text-xs leading-relaxed">Mountain View (Pacific Ingress Core)</p>
              <p className="text-xs leading-relaxed mt-0.5">Bengaluru (Subcontinent Express Node)</p>
            </div>
          </div>

        </motion.section>

      </div>
    </div>
  );
};
export default ContactView;
