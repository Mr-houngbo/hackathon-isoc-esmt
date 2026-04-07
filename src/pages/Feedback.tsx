import { motion } from "framer-motion";
import { useState } from "react";
import { MessageSquare, Send, Star, CheckCircle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Client supabase non typé pour la table feedbacks
const supabaseClient = supabase as any;

const Feedback = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: "",
    rating: 0,
    message: "",
    email: "",
  });

  const feedbackTypes = [
    { value: "bug", label: "🐛 Signaler un bug", color: "#DC2626" },
    { value: "improvement", label: "💡 Suggestion d'amélioration", color: "#40B2A4" },
    { value: "feature", label: "✨ Demande de fonctionnalité", color: "#24366E" },
    { value: "other", label: "📝 Autre", color: "#6C757D" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type) {
      toast.error("Veuillez sélectionner un type de feedback");
      return;
    }
    if (formData.rating === 0) {
      toast.error("Veuillez donner une note");
      return;
    }
    if (!formData.message.trim()) {
      toast.error("Veuillez décrire votre feedback");
      return;
    }

    setLoading(true);

    try {
      // Insertion dans Supabase
      const { error } = await supabaseClient
        .from('feedbacks')
        .insert({
          type: formData.type,
          rating: formData.rating,
          message: formData.message,
          email: formData.email || null,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      setLoading(false);
      setSubmitted(true);
      toast.success("Merci pour votre feedback !");
    } catch (error: any) {
      console.error(error);
      setLoading(false);
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };

  if (submitted) {
    return (
      <Layout>
        <div className="container max-w-2xl py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl border border-[#E9ECEF] p-8 md:p-12 shadow-lg text-center"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-[#40B2A4] to-[#24366E] rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h1 
              className="font-display text-2xl md:text-3xl font-bold text-[#212529] mb-4"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Merci pour votre feedback !
            </h1>
            <p 
              className="text-[#6C757D] text-lg mb-8"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Votre avis nous aide à améliorer la plateforme. Nous l'examinerons attentivement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/")}
                className="btn-premium px-8 py-3 rounded-xl font-semibold text-white"
              >
                Retour à l'accueil
              </button>
              <button
                onClick={() => setSubmitted(false)}
                className="px-8 py-3 rounded-xl font-semibold border-2 border-[#E9ECEF] text-[#6C757D] hover:border-[#40B2A4] hover:text-[#40B2A4] transition-colors"
              >
                Envoyer un autre feedback
              </button>
            </div>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-2xl py-8 md:py-12">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[#6C757D] hover:text-[#40B2A4] transition-colors"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            <ArrowLeft size={20} />
            Retour
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-[#40B2A4] to-[#24366E] rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={28} className="text-white" />
          </div>
          <h1 
            className="font-display text-2xl md:text-3xl font-bold text-[#212529] mb-2"
            style={{ fontFamily: 'Sora, sans-serif' }}
          >
            Votre feedback
          </h1>
          <p 
            className="text-[#6C757D]"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          >
            Aidez-nous à améliorer la plateforme
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E9ECEF] p-6 md:p-8 shadow-lg space-y-6"
        >
          {/* Type de feedback */}
          <div>
            <label 
              className="block font-display text-sm font-semibold text-[#212529] mb-3"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Type de feedback <span className="text-[#DC2626]">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {feedbackTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-300 ${
                    formData.type === type.value
                      ? 'border-[#40B2A4] bg-[#40B2A4]/10'
                      : 'border-[#E9ECEF] hover:border-[#40B2A4]/30'
                  }`}
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  <span className={formData.type === type.value ? 'text-[#40B2A4]' : 'text-[#212529]'}>
                    {type.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div>
            <label 
              className="block font-display text-sm font-semibold text-[#212529] mb-3"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Note globale <span className="text-[#DC2626]">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className="p-2 transition-transform hover:scale-110"
                >
                  <Star
                    size={32}
                    className={`transition-colors ${
                      star <= formData.rating
                        ? 'fill-[#F59E0B] text-[#F59E0B]'
                        : 'text-[#E9ECEF]'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Message */}
          <div>
            <label 
              className="block font-display text-sm font-semibold text-[#212529] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Votre message <span className="text-[#DC2626]">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Décrivez votre expérience, signalez un bug, ou suggérez une amélioration..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all resize-none"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
          </div>

          {/* Email (optional) */}
          <div>
            <label 
              className="block font-display text-sm font-semibold text-[#212529] mb-2"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              Email <span className="text-[#6C757D] font-normal">(optionnel)</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="votre.email@exemple.com"
              className="w-full px-4 py-3 rounded-xl border border-[#E9ECEF] bg-white text-[#212529] placeholder-[#6C757D] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 transition-all"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            />
            <p 
              className="text-xs text-[#6C757D] mt-1"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Pour vous tenir informé de la résolution ou de la mise en place de votre suggestion
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-premium flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Envoi en cours...
              </>
            ) : (
              <>
                <Send size={20} />
                Envoyer mon feedback
              </>
            )}
          </button>
        </motion.form>
      </div>
    </Layout>
  );
};

export default Feedback;
