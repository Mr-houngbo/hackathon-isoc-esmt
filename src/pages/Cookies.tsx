import { motion } from "framer-motion";
import { Cookie, Settings, Shield, Eye, Chrome } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const Cookies = () => {
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
                <Cookie size={32} className="text-white" />
              </div>
              <h1 
                className="font-display text-4xl font-bold text-slate-900"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
              >
                Politique des Cookies
              </h1>
            </div>
            <p 
              className="text-slate-600 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              Comment nous utilisons les cookies pour améliorer votre expérience
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
            {/* What are cookies */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Cookie className="text-amber-500" />
                Qu'est-ce qu'un Cookie ?
              </h2>
              <p 
                className="text-slate-600 leading-relaxed mb-4"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Un cookie est un petit fichier texte stocké sur votre navigateur lorsque vous visitez notre site. 
                Il nous permet de mémoriser vos préférences et d'améliorer votre expérience utilisateur.
              </p>
              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <p className="text-amber-800 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <strong>🔍 Notre engagement :</strong> Nous n'utilisons aucun cookie pour suivre votre navigation sur d'autres sites web.
                  Seuls les cookies essentiels et analytiques anonymisés sont employés.
                </p>
              </div>
            </div>

            {/* Types of cookies */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Settings className="text-amber-500" />
                Types de Cookies Utilisés
              </h2>
              <div className="space-y-4">
                {/* Essential cookies */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                        Cookies Essentiels
                      </h3>
                      <p className="text-slate-600 text-sm mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Indispensables au fonctionnement du site
                      </p>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Authentification et session utilisateur</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Panier d'inscription et formulaires</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Préférences d'affichage et langue</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          <span>Mesures de sécurité</span>
                        </li>
                      </ul>
                      <p className="text-xs text-slate-500 mt-3">
                        <strong>Durée :</strong> Session à 13 mois | <strong>Option :</strong> Non désactivables
                      </p>
                    </div>
                  </div>
                </div>

                {/* Analytics cookies */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>
                        Cookies Analytiques
                      </h3>
                      <p className="text-slate-600 text-sm mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Pour comprendre et améliorer nos services
                      </p>
                      <ul className="space-y-2 text-sm text-slate-600">
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Pages visitées et temps de consultation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Statistiques d'utilisation anonymisées</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Taux de conversion des inscriptions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>Détection des erreurs techniques</span>
                        </li>
                      </ul>
                      <p className="text-xs text-slate-500 mt-3">
                        <strong>Durée :</strong> 13 mois maximum | <strong>Option :</strong> Désactivables
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* What we don't use */}
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 p-8">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                🚫 Ce que nous n'utilisons PAS
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border border-red-200">
                  <p className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="text-red-500">❌</span> Cookies publicitaires
                  </p>
                  <p className="text-slate-600 text-sm">Pas de suivi publicitaire ou de retargeting</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-200">
                  <p className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="text-red-500">❌</span> Cookies de réseaux sociaux
                  </p>
                  <p className="text-slate-600 text-sm">Pas de partage avec les réseaux sociaux</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-200">
                  <p className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="text-red-500">❌</span> Cookies de profilage
                  </p>
                  <p className="text-slate-600 text-sm">Pas de création de profils utilisateurs</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-red-200">
                  <p className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <span className="text-red-500">❌</span> Cookies tiers
                  </p>
                  <p className="text-slate-600 text-sm">Pas de partage avec des tiers</p>
                </div>
              </div>
            </div>

            {/* Management */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Chrome className="text-amber-500" />
                Gérer vos Cookies
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    📱 Paramètres du navigateur
                  </h3>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-slate-600 text-sm mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                      Vous pouvez gérer les cookies directement depuis votre navigateur :
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Chrome:</span>
                        <span>Paramètres → Confidentialité et sécurité → Cookies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Firefox:</span>
                        <span>Options → Vie privée et sécurité → Cookies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Safari:</span>
                        <span>Préférences → Confidentialité → Gérer les données web</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    ⚙️ Options disponibles
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <p className="font-semibold text-slate-900 mb-1">✅ Accepter</p>
                      <p className="text-slate-600 text-sm">Utilisation optimale du site</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <p className="font-semibold text-slate-900 mb-1">⚠️ Refuser</p>
                      <p className="text-slate-600 text-sm">Fonctionnalités limitées</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <p className="font-semibold text-slate-900 mb-1">🗑️ Supprimer</p>
                      <p className="text-slate-600 text-sm">Effacer les cookies existants</p>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                      <p className="font-semibold text-slate-900 mb-1">🔍 Consulter</p>
                      <p className="text-slate-600 text-sm">Voir les cookies stockés</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Updates */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-8">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                📅 Mises à jour
              </h2>
              <div className="space-y-4">
                <p 
                  className="text-slate-700"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Cette politique peut être mise à jour pour refléter les changements dans nos pratiques 
                  ou pour des raisons réglementaires. Nous vous informerons de toute modification importante.
                </p>
                <div className="bg-white rounded-xl p-4 border border-amber-200">
                  <p className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    📧 Notifications
                  </p>
                  <p className="text-slate-600 text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Les modifications importantes seront annoncées sur notre site et par email aux participants inscrits.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-slate-900 mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                📞 Contact
              </h2>
              <div className="space-y-4">
                <p 
                  className="text-slate-600"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Pour toute question sur notre politique de cookies :
                </p>
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="font-semibold text-slate-900 mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    📧 Email
                  </p>
                  <p className="text-slate-600" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    club_esmt@isoc.sn
                  </p>
                  <p className="text-slate-500 text-sm mt-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                    Objet : "Question Cookies"
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

export default Cookies;
