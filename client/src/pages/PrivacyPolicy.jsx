import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Lock, Database, EyeOff, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white">
      {/* Glow Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-[128px]"></div>
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-secondary/15 rounded-full blur-[128px]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-12">
        {/* Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <Button asChild variant="outline" size="sm" className="border-gray-800 text-gray-300 hover:text-white">
            <Link to="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to GymGenius
            </Link>
          </Button>

          <span className="text-xs text-gray-500 font-mono">Effective: September 2026</span>
        </div>

        {/* Hero Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-gray-800/80 shadow-2xl mb-10">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 border border-primary/30">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-200 to-gray-400 bg-clip-text text-transparent">
            GymGenius Privacy Policy
          </h1>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Your physical training data is deeply personal. We treat your biometric metrics, workout logs, and nutrition plans with institutional-grade cryptographic security.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-8 text-gray-300 leading-relaxed text-sm">
          {/* Section 1 */}
          <div className="p-6 rounded-xl bg-gray-950/80 border border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
              <Database className="w-5 h-5 text-primary" />
              1. Information We Collect
            </h2>
            <p className="mb-3">
              To deliver precision AI training recommendations, GymGenius collects:
            </p>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li><strong className="text-gray-200">Account Credentials:</strong> Name, verified email address, and encrypted passwords.</li>
              <li><strong className="text-gray-200">Biometric & Fitness Parameters:</strong> Current height, bodyweight logs, target goals, and training experience levels.</li>
              <li><strong className="text-gray-200">Performance Metrics:</strong> Workout history, sets, reps, streak frequency, and personal records.</li>
              <li><strong className="text-gray-200">Nutrition Preferences:</strong> Caloric targets, dietary restrictions, and meal preferences.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-6 rounded-xl bg-gray-950/80 border border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
              <EyeOff className="w-5 h-5 text-secondary" />
              2. AI Intelligence Protocol & Neural Privacy
            </h2>
            <p className="mb-3">
              When you consult the GymGenius AI Performance Hub:
            </p>
            <ul className="space-y-2 list-disc list-inside text-gray-400">
              <li>Prompt inquiries sent to our neural engine (powered by Google Gemini & OpenRouter APIs) are strictly ephemeral.</li>
              <li>Your personal identifying data (email, real name, passwords) is <strong>never</strong> transmitted to third-party LLM providers.</li>
              <li>Your workout queries are not retained by AI providers to train public models.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-6 rounded-xl bg-gray-950/80 border border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
              <Lock className="w-5 h-5 text-emerald-400" />
              3. Cryptographic Security Standards
            </h2>
            <p className="mb-3">
              We employ bank-grade security across all endpoints:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="p-4 rounded-lg bg-black/50 border border-gray-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-xs">Bcrypt Password Hashing</p>
                  <p className="text-xs text-gray-500 mt-0.5">Passwords are irreversibly salted and hashed. Even administrators cannot view raw passwords.</p>
                </div>
              </div>
              <div className="p-4 rounded-lg bg-black/50 border border-gray-800 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-white text-xs">HTTPS & JWT Authentication</p>
                  <p className="text-xs text-gray-500 mt-0.5">All transmissions are encrypted via TLS 1.3 with stateless JSON Web Tokens.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 */}
          <div className="p-6 rounded-xl bg-gray-950/80 border border-gray-800">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-3">
              <FileText className="w-5 h-5 text-amber-400" />
              4. Athlete Rights & Account Removal
            </h2>
            <p className="leading-relaxed">
              You own your training data. You may request total erasure of your account, streaks, and training logs at any time. When an administrator or athlete deletes an account, all database entries are permanently scrubbed from MongoDB Atlas within 24 hours.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-900 text-center text-xs text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 GymGenius AI. All rights reserved.</p>
          <div className="space-x-4">
            <Link to="/login" className="hover:text-primary transition">Login</Link>
            <Link to="/register" className="hover:text-primary transition">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
