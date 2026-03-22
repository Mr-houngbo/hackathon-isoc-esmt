import { motion } from "framer-motion";
import { FileText, Shield, Users, Award, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";

const TermesConditions = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white py-12">
        <div className="container max-w-4xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#FEEB09] to-[#24366E] flex items-center justify-center">
                <FileText size={32} className="text-white" />
              </div>
              <h1 
                className="font-display text-4xl font-bold text-[#212529]"
                style={{ fontFamily: 'Sora, sans-serif', fontWeight: 800 }}
              >
                Termes et Conditions
              </h1>
            </div>
            <p 
              className="text-[#6C757D] text-lg max-w-2xl mx-auto"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              2ème Hackathon ISOC-ESMT - 17 & 18 Avril 2026
            </p>
            <div className="w-24 h-1 bg-gradient-to-r from-[#FEEB09] to-[#24366E] mx-auto rounded-full mt-4"></div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Introduction */}
            <div className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-[#212529] mb-4 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Shield className="text-[#FEEB09]" />
                Préambule
              </h2>
              <p 
                className="text-[#6C757D] leading-relaxed"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                Les présents termes et conditions régissent la participation au 2ème Hackathon ISOC-ESMT, organisé par le Club ISOC de l'École Supérieure Multinationale des Télécommunications (ESMT) de Dakar. 
                En participant à cet événement, vous acceptez sans réserve les dispositions ci-dessous.
              </p>
            </div>

            {/* Équipes */}
            <div className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-[#212529] mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Users className="text-[#FEEB09]" />
                Composition des Équipes
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Équipes de 4 membres</strong> - La participation individuelle est acceptée mais non prioritaire dans le processus de sélection.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Équipes pluridisciplinaires</strong> - La composition équilibrée entre profils techniques (tech), design, business et communication est vivement encouragée. 
                    Les étudiants de toutes les filières et de tous établissements sont les bienvenus pour favoriser la diversité des compétences.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Participation féminine</strong> - Le Club ISOC-ESMT encourage activement la participation des femmes et s'engage à promouvoir l'inclusivité dans le secteur technologique.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Exclusivité</strong> - Un même participant ne peut pas être inscrit dans deux équipes différentes. Toute violation de cette règle entraînera l'exclusion immédiate des deux équipes concernées.
                  </p>
                </div>
              </div>
            </div>

            {/* Projets */}
            <div className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-[#212529] mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Award className="text-[#FEEB09]" />
                Thématiques et Projets
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Définition des thématiques</strong> - Les thématiques du hackathon sont ouvertes et définies en concertation avec les partenaires. Chaque partenaire est invité à soumettre un défi basé sur ses besoins métiers ou une problématique sectorielle, mais les équipes peuvent également proposer leurs propres thématiques innovantes en lien avec les technologies actuelles.
                  </p>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-4 mt-4">
                  <h3 
                    className="font-semibold text-[#212529] mb-3"
                    style={{ fontFamily: 'Sora, sans-serif' }}
                  >
                    Thématiques suggérées par les partenaires :
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FEEB09] mt-1">▪</span>
                      <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Innovation sociale et inclusion numérique
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FEEB09] mt-1">▪</span>
                      <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Smart City et développement durable
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FEEB09] mt-1">▪</span>
                      <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Services publics et Intelligence Artificielle
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FEEB09] mt-1">▪</span>
                      <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Digitalisation des processus (pointage, réservation, restauration, plateformes numériques)
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Sélection des thématiques</strong> - Un comité de sélection réunissant les partenaires et l'équipe d'organisation retiendra les 10 thématiques les plus pertinentes. Les équipes sélectionnées recevront leur thématique assignée au début du hackathon.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Bénéfices pour les partenaires</strong> - En soumettant un projet, le partenaire bénéficie d'un regard neuf et de solutions innovantes conçues par un vivier de talents qualifiés directement mobilisables pour ses projets futurs.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Originalité et innovation</strong> - Les solutions développées doivent être originales et innovantes. Le copier-coller d'une application existante n'est pas autorisé. Les équipes sont encouragées à proposer des approches créatives adaptées à la thématique assignée.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Pré-inscription</strong> - Chaque équipe doit obligatoirement remplir le formulaire de pré-inscription complet pour être considérée dans le processus de sélection.
                  </p>
                </div>
              </div>
            </div>

            {/* Participants */}
            <div className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-[#212529] mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Users className="text-[#FEEB09]" />
                Conditions de Participation
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Éligibilité</strong> - La participation est ouverte à tous les étudiants, avec une priorité accordée aux étudiants régulièrement inscrits à l'ESMT. Les étudiants des autres établissements sont les bienvenus dans la limite des places disponibles.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Statut administratif</strong> - Les étudiants de l'ESMT doivent être en règle avec l'administration (frais de scolarité payés, dossier administratif complet). Les étudiants des autres établissements doivent fournir un certificat de scolarité valide.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Présence obligatoire</strong> - La présence aux deux jours du hackathon (17 et 18 Avril 2026) est obligatoire. Toute absence non justifiée entraînera la disqualification immédiate de l'équipe.
                  </p>
                </div>
              </div>
            </div>

            {/* Éthique */}
            <div className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-[#212529] mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Shield className="text-[#FEEB09]" />
                Éthique et Fair-Play
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Création pendant le hackathon</strong> - Tout le code source, design et contenu produit doit être créé pendant la durée du hackathon. Les projets préexistants ne sont pas acceptés.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Utilisation de l'IA</strong> - L'utilisation d'outils d'intelligence artificielle est autorisée mais doit être obligatoirement déclarée lors du pitch final.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Respect mutuel</strong> - Le respect des autres équipes, des mentors et du jury est impératif. Tout comportement irrespectueux ou harcellement entraînera l'exclusion immédiate.
                  </p>
                </div>
              </div>
            </div>

            {/* Propriété Intellectuelle */}
            <div className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-[#212529] mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Shield className="text-[#FEEB09]" />
                Propriété Intellectuelle et Droits à l'Image
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Droits d'auteur</strong> - Les projets soumis deviennent la propriété intellectuelle exclusive de leurs auteurs. Le Club ISOC-ESMT ne revendique aucun droit sur les projets développés.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Droit à l'image</strong> - En participant, chaque participant autorise le Club ISOC-ESMT à utiliser ses images (photos et vidéos) à des fins de communication, de promotion et de mise en valeur des activités du club.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Portée de l'autorisation</strong> - Cette autorisation couvre tous les supports de communication du Club ISOC-ESMT (site web, réseaux sociaux, communications internes et externes, rapports d'activités, etc.).
                  </p>
                </div>
              </div>
            </div>

            {/* Sélection */}
            <div className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg">
              <h2 
                className="font-display text-2xl font-bold text-[#212529] mb-6 flex items-center gap-3"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                <Award className="text-[#FEEB09]" />
                Processus de Sélection
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Comité de sélection</strong> - Toutes les candidatures sont examinées par un comité de sélection composé de membres du Club ISOC-ESMT et d'experts externes.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Critères de priorité</strong> - En cas de sureffectif, les critères de sélection suivants s'appliquent par ordre de priorité :
                  </p>
                </div>
                <div className="bg-[#F8F9FA] rounded-xl p-4 mt-4">
                  <ol className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-[#FEEB09] font-bold">1.</span>
                      <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Équipes complètes (4 membres)
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FEEB09] font-bold">2.</span>
                      <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Projets déjà définis et pertinents
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FEEB09] font-bold">3.</span>
                      <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Diversité des profils au sein de l'équipe
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#FEEB09] font-bold">4.</span>
                      <span className="text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Candidatures individuelles exceptionnelles
                      </span>
                    </li>
                  </ol>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Notification</strong> - Les équipes retenues recevront une confirmation officielle par email et une invitation à rejoindre le groupe WhatsApp du hackathon dans les 72h suivant la soumission.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#FEEB09] rounded-full mt-2 flex-shrink-0"></div>
                  <p 
                    className="text-[#6C757D] leading-relaxed"
                    style={{ fontFamily: 'DM Sans, sans-serif' }}
                  >
                    <strong>Liste d'attente</strong> - Une liste d'attente sera également établie. En cas de désistement, les équipes sur liste d'attente seront contactées dans l'ordre chronologique de leur inscription.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-gradient-to-r from-[#FEEB09]/10 to-[#24366E]/10 rounded-2xl border border-[#E9ECEF] p-8">
              <h2 
                className="font-display text-2xl font-bold text-[#212529] mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Contact et Informations
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <Mail className="text-[#FEEB09]" size={20} />
                  <div>
                    <p 
                      className="font-semibold text-[#212529]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Email
                    </p>
                    <p 
                      className="text-[#6C757D] text-sm"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      isoc.esmt@gmail.com
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="text-[#FEEB09]" size={20} />
                  <div>
                    <p 
                      className="font-semibold text-[#212529]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Email Club
                    </p>
                    <p 
                      className="text-[#6C757D] text-sm"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      club_esmt@isoc.sn
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-[#FEEB09]" size={20} />
                  <div>
                    <p 
                      className="font-semibold text-[#212529]"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      Lieu
                    </p>
                    <p 
                      className="text-[#6C757D] text-sm"
                      style={{ fontFamily: 'DM Sans, sans-serif' }}
                    >
                      ESMT Dakar
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-12">
              <p 
                className="text-[#6C757D] text-sm"
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                En participant au 2ème Hackathon ISOC-ESMT, vous reconnaissez avoir lu, compris et accepté l'intégralité des présents termes et conditions.
              </p>
              <div className="mt-6">
                <Link 
                  to="/"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FEEB09] to-[#24366E] text-white rounded-xl font-semibold transition-all hover:scale-105"
                  style={{ fontFamily: 'DM Sans, sans-serif' }}
                >
                  Retour à l'accueil
                </Link>
              </div>
            </div>

            {/* Mentions Légales */}
            <div id="mentions-legales" className="mt-16 pt-16 border-t border-[#E9ECEF]">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-2xl font-bold text-[#212529] mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Mentions Légales
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg space-y-4"
              >
                <p className="text-[#6C757D] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <strong>Éditeur du site :</strong><br/>
                  Club ISOC-ESMT<br/>
                  École Supérieure Multinationale des Télécommunications<br/>
                  Route de Deroule, BP 10 000, Dakar, Sénégal<br/><br/>
                  
                  <strong>Contact :</strong><br/>
                  Email : club_esmt@isoc.sn<br/>
                  Téléphone : +221 33 824 50 00<br/><br/>
                  
                  <strong>Hébergement :</strong><br/>
                  Ce site est hébergé sur les serveurs de l'ESMT Dakar.<br/><br/>
                  
                  <strong>Directeur de publication :</strong><br/>
                  Président du Club ISOC-ESMT
                </p>
              </motion.div>
            </div>

            {/* Confidentialité */}
            <div id="confidentialite" className="mt-16 pt-16 border-t border-[#E9ECEF]">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="font-display text-2xl font-bold text-[#212529] mb-6"
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                Politique de Confidentialité
              </motion.h2>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-2xl border border-[#E9ECEF] p-8 shadow-lg space-y-4"
              >
                <p className="text-[#6C757D] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  <strong>Collecte des données :</strong><br/>
                  Les informations personnelles collectées lors de l'inscription (nom, email, téléphone, etc.) sont exclusivement utilisées pour l'organisation du hackathon ISOC-ESMT.<br/><br/>
                  
                  <strong>Finalité du traitement :</strong><br/>
                  Gestion des candidatures, communication avec les participants, organisation logistique de l'événement.<br/><br/>
                  
                  <strong>Conservation des données :</strong><br/>
                  Les données sont conservées pendant la durée nécessaire à l'organisation du hackathon et sont détruites après 6 mois.<br/><br/>
                  
                  <strong>Droits des participants :</strong><br/>
                  Conformément à la loi n°2008-12 du 25 janvier 2008 relative à la protection des données personnelles, vous disposez d'un droit d'accès, de modification et de suppression de vos données.<br/><br/>
                  
                  <strong>Droit à l'image :</strong><br/>
                  En participant, vous autorisez le Club ISOC-ESMT à utiliser vos images à des fins de communication et de promotion des activités du club.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default TermesConditions;
