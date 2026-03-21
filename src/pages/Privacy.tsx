import { motion } from "framer-motion";
import { Shield, Eye, Mail, Lock, Database, UserCheck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const Privacy = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white py-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 flex items-center justify-center">
                <Shield size={32} className="text-white" />
              </div>
              <h1 
                className="font-display text-4xl font-bold text-slate-900"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
              >
                Politique de Confidentialité
              </h1>
            </div>
            <p 
              className="text-slate-600 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Protection de vos données personnelles et respect de votre vie privée
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-500 to-orange-600 mx-auto rounded-full mt-4"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Introduction */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Eye className="text-amber-500" />
                Notre Engagement
              </h2>
              <p 
                className="text-slate-600 leading-relaxed"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Le Club ISOC-ESMT s'engage à protéger la vie privée de tous les participants au hackathon. 
                Cette politique décrit comment nous collectons, utilisons et protégeons vos informations personnelles 
                conformément à la loi n°2008-12 du 25 janvier 2008 relative à la protection des données personnelles au Sénégal.
              </p>
            </div>

            {/* Data Collection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Database className="text-amber-500" />
                Données Collectées
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p 
                      className="font-semibold text-slate-900 mb-1"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Informations d'inscription
                    </p>
                    <p 
                      className="text-slate-600"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Nom, prénom, email, téléphone, établissement, filière, niveau d'étude
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p 
                      className="font-semibold text-slate-900 mb-1"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Informations de participation
                    </p>
                    <p 
                      className="text-slate-600"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Équipe, projet soumis, présence aux événements, interactions avec les mentors
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p 
                      className="font-semibold text-slate-900 mb-1"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Données techniques
                    </p>
                    <p 
                      className="text-slate-600"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Adresse IP, type de navigateur, heures d'accès au site (cookies analytiques)
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <UserCheck className="text-amber-500" />
                Utilisation des Données
              </h2>
              <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      <strong>Gestion administrative :</strong> Sélection des équipes, communication logistique
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      <strong>Organisation de l'événement :</strong> Planification, coordination, suivi
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      <strong>Amélioration des services :</strong> Analyse des données pour optimiser l'expérience
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-1">✓</span>
                    <span className="text-slate-700" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      <strong>Communication :</strong> Informations importantes, rappels, résultats
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Protection */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Lock className="text-amber-500" />
                Mesures de Sécurité
              </h2>
              <div className="space-y-4">
                <p 
                  className="text-slate-600 leading-relaxed"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger 
                  vos données contre la perte, l'accès non autorisé, la modification ou la divulgation.
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      🔐 Sécurité technique
                    </p>
                    <p className="text-slate-600 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Chiffrement SSL, serveurs sécurisés, accès protégé
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      👥 Accès limité
                    </p>
                    <p className="text-slate-600 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Seul le personnel autorisé peut accéder aux données
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rights */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Vos Droits
              </h2>
              <div className="space-y-4">
                <p 
                  className="text-slate-700"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Conformément à la loi sénégalaise, vous disposez des droits suivants :
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <p className="font-semibold text-slate-900 mb-1">🔍 Droit d'accès</p>
                    <p className="text-slate-600 text-sm">Consulter vos données personnelles</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <p className="font-semibold text-slate-900 mb-1">✏️ Droit de modification</p>
                    <p className="text-slate-600 text-sm">Mettre à jour vos informations</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <p className="font-semibold text-slate-900 mb-1">🗑️ Droit de suppression</p>
                    <p className="text-slate-600 text-sm">Demander la suppression de vos données</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-amber-200">
                    <p className="font-semibold text-slate-900 mb-1">⏰ Durée de conservation</p>
                    <p className="text-slate-600 text-sm">6 mois maximum après l'événement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Mail className="text-amber-500" />
                Contact
              </h2>
              <div className="space-y-4">
                <p 
                  className="text-slate-600"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Pour toute question concernant cette politique ou l'exercice de vos droits, contactez-nous :
                </p>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    📧 Email
                  </p>
                  <p className="text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    club_esmt@isoc.sn
                  </p>
                  <p className="text-slate-500 text-sm mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Nous répondrons sous 48 heures
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12">
              <p 
                className="text-slate-500 text-sm mb-6"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Dernière mise à jour : Mars 2026
              </p>
              <Link 
                to="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold transition-all hover:scale-105"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Retour à l'accueil
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
