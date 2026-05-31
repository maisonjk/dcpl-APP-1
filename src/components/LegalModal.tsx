import React from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";

type DocType = "terms" | "privacy";

interface LegalModalProps {
  doc: DocType;
  onClose: () => void;
}

const TERMS = `
**Terms of Service**
Last updated: 2026-05-30

By using DCPL ("the App"), you agree to these terms.

1. **Eligibility.** You must be 13 or older to use the App.

2. **Your Content.** Prayers and notes you enter are yours. You grant DCPL a limited license to store and display them to you and any accountability partners you explicitly share with.

3. **Account Security.** Keep your password confidential. You are responsible for activity under your account.

4. **Acceptable Use.** Do not use the App to harass others, share unlawful content, or interfere with other users.

5. **Subscriptions & Billing.** Paid plans are billed through Stripe. You can cancel anytime from the Membership Plans screen. Refunds follow Stripe's standard policy.

6. **Termination.** We may suspend accounts that violate these terms. You may delete your account at any time.

7. **Disclaimer.** The App is provided "as is" without warranties of any kind.

8. **Limitation of Liability.** DCPL is not liable for indirect, incidental, or consequential damages.

9. **Changes.** We may update these terms. Continued use after changes means you accept them.

10. **Contact.** Questions? Email us at support@dcpl.app.
`;

const PRIVACY = `
**Privacy Policy**
Last updated: 2026-05-30

1. **What We Collect.**
   - Account data: email address, display name, password (hashed — we never store plaintext).
   - Content you create: prayers, journal entries, mission progress, study plan progress.
   - Usage data: which features you use, streak counts, completion milestones.

2. **How We Use It.**
   - To provide and improve the App.
   - To send you reminders you've opted into (notifications).
   - To process payments via Stripe (we never see your card details).

3. **Who We Share It With.**
   - Accountability Partners: only the prayers you explicitly choose to share.
   - Stripe: for payment processing. See stripe.com/privacy.
   - No one else. We do not sell your data.

4. **Data Storage.** Your data is stored on secure servers. Passwords are hashed with bcrypt. Connections use HTTPS.

5. **Your Rights.** You may request a copy of your data or deletion of your account by emailing support@dcpl.app.

6. **Cookies.** The App uses localStorage for session tokens. No third-party tracking cookies.

7. **Children.** We do not knowingly collect data from children under 13.

8. **Changes.** We will notify users of material changes to this policy.

9. **Contact.** support@dcpl.app
`;

function renderDoc(text: string) {
  return text.trim().split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <h3 key={i} className="font-serif text-lg font-bold text-[#1A1A1A] mt-6 mb-2">{line.replace(/\*\*/g, "")}</h3>;
    }
    if (/^\d+\. \*\*/.test(line)) {
      const parts = line.replace(/^\d+\. /, "").split(/\*\*(.*?)\*\*/);
      return (
        <p key={i} className="text-sm font-sans text-neutral-700 leading-relaxed mb-2">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
        </p>
      );
    }
    if (line.startsWith("   - ")) {
      return <li key={i} className="text-sm font-sans text-neutral-600 ml-4 list-disc leading-relaxed">{line.replace(/^   - /, "")}</li>;
    }
    if (line.trim() === "") return <div key={i} className="h-1" />;
    return <p key={i} className="text-sm font-sans text-neutral-700 leading-relaxed mb-1">{line}</p>;
  });
}

export default function LegalModal({ doc, onClose }: LegalModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-white border-2 border-[#1A1A1A] w-full sm:max-w-lg relative z-10 max-h-[85vh] flex flex-col"
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#1A1A1A] flex-shrink-0">
          <h2 className="font-serif text-lg font-bold text-[#1A1A1A]">
            {doc === "terms" ? "Terms of Service" : "Privacy Policy"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 border border-[#1A1A1A] flex items-center justify-center hover:bg-neutral-100 transition">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5 flex-1">
          {renderDoc(doc === "terms" ? TERMS : PRIVACY)}
        </div>
      </motion.div>
    </div>
  );
}
