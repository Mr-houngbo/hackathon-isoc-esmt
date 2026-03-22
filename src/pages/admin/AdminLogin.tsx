import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock, Shield, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { 
      toast.error("Identifiants incorrects"); 
    } else { 
      toast.success("Connexion réussie");
      navigate("/admin/dashboard"); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white flex items-center justify-center">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#24366E]/10 via-[#FEEB09]/5 to-white"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(30, 58, 95, 0.1) 0%, transparent 50%)`,
        }}></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-auto p-6"
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#E9ECEF] bg-white shadow-2xl shadow-[#24366E]/10">
          {/* Header */}
          <div className="text-center mb-8 p-8 bg-gradient-to-r from-[#24366E]/10 to-[#FEEB09]/10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#24366E] to-[#FEEB09] flex items-center justify-center">
                <Shield size={32} className="text-white" />
              </div>
              <h1 
                className="font-display text-2xl font-bold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
              >
                Admin Dashboard
              </h1>
            </div>
            <p 
              className="text-[#6C757D]"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Hackathon ISOC-ESMT 2026
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-[#24366E] to-[#FEEB09] mx-auto rounded-full"></div>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div>
                <label 
                  className="block text-sm font-bold text-[#212529] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Email Administrateur
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D]" />
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required
                    placeholder="admin@hackathon.sn"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-[#E9ECEF] bg-white px-4 py-3 text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label 
                  className="block text-sm font-bold text-[#212529] mb-3"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6C757D]" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required
                    placeholder="••••••••••"
                    className="w-full pl-12 pr-12 py-3 rounded-xl border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#FEEB09] focus:border-transparent transition-all duration-300"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6C757D] hover:text-[#FEEB09] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit" 
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#24366E] to-[#FEEB09] text-white font-bold shadow-lg shadow-[#24366E]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#24366E]/40 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <Loader2 size={20} className="animate-spin" />
                    <span>Connexion en cours...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Shield size={20} />
                    <span>Se connecter</span>
                  </div>
                )}
              </motion.button>
            </form>

            {/* Security Note */}
            <div className="mt-8 p-4 rounded-xl bg-[#F8F9FA]/50 border border-[#E9ECEF]/50">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-[#FEEB09] mt-0.5" />
                <div>
                  <p 
                    className="text-xs text-[#6C757D] font-medium"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    🔒 Connexion sécurisée via Supabase Auth
                  </p>
                  <p 
                    className="text-xs text-[#6C757D] mt-1"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Accès réservé aux administrateurs du hackathon
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
