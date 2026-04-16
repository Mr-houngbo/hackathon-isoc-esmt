import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/layout/AdminLayout";
import { toast } from "sonner";
import { Plus, Trash2, Save, Search, Filter, Download, Award, QrCode, Calendar, User, Mail, Users, CheckCircle, XCircle, Clock, ChevronDown, ChevronUp, RefreshCw, Eye, Send } from "lucide-react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import emailjs from "@emailjs/browser";

const GestionBadges = () => {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<'participants' | 'staff' | 'historique'>('participants');
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<'tous' | 'participants' | 'staff'>('tous');
  const [filterStatus, setFilterStatus] = useState<'tous' | 'envoyes' | 'non_envoyes'>('tous');
  
  // Formulaire staff
  const [staffForm, setStaffForm] = useState({
    nom_prenom: '',
    email: '',
    role: '',
    organisation: ''
  });

  // Staff badges générés pour le rendu PDF
  const [staffBadgesForRender, setStaffBadgesForRender] = useState<Array<{ id: string; staff_info: typeof staffForm }>>([]);

  // Badges participants nouvellement créés pour le rendu PDF
  const [participantBadgesForRender, setParticipantBadgesForRender] = useState<Array<{ id: string; membre_id: string; equipe_id: string }>>([]);

  // Références pour les badges cachés
  const badgeRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Configuration EmailJS (à remplacer avec vos vraies clés)
  const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_sjwwc4m',
    TEMPLATE_ID: 'template_j937zyq',
    PUBLIC_KEY: 'upjtSwtuR2QWNcwhb'
  };

  // Récupérer les équipes sélectionnées avec leurs membres
  const { data: equipesSelectionnees, isLoading: isLoadingEquipes } = useQuery({
    queryKey: ["equipes-selectionnees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipes")
        .select(`
          *,
          membres(
            id,
            nom_prenom,
            email,
            est_chef,
            role_equipe,
            genre,
            filiere,
            badges(
              id,
              envoye,
              date_envoi,
              qr_code_url
            )
          )
        `)
        .eq("statut", "selectionne")
        .order("nom_equipe");
      
      if (error) throw error;
      return data;
    },
  });

  // Récupérer tous les badges pour l'historique
  const { data: allBadges, isLoading: isLoadingBadges, refetch: refetchBadges } = useQuery({
    queryKey: ["all-badges"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("badges")
        .select(`
          *,
          membre:membres(nom_prenom, email, filiere, est_chef, role_equipe),
          equipe:equipes(nom_equipe, type_candidature, statut)
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Mutation pour générer des badges
  const genererBadgesMutation = useMutation({
    mutationFn: async ({ equipeId, membreIds }: { equipeId: string, membreIds?: string[] }) => {
      const equipe = equipesSelectionnees?.find(e => e.id === equipeId);
      if (!equipe) throw new Error("Équipe non trouvée");

      const membresToProcess = membreIds 
        ? equipe.membres.filter(m => membreIds.includes(m.id))
        : equipe.membres;

      const badgesGeneres = [];

      for (const membre of membresToProcess) {
        // Créer un nouveau badge (pas de vérification d'existant pour permettre la génération multiple)
        const badgeExistant = membre.badges?.[0];
        if (badgeExistant) {
          // Optionnel : supprimer l'ancien badge de la base pour ne pas avoir de doublons
          // Mais on génère quand même un nouveau
          await supabase.from("badges").delete().eq('id', badgeExistant.id);
        }

        // Créer le badge
        const badgeId = crypto.randomUUID();
        const qrUrl = `${window.location.origin}/verification/${badgeId}`;

        const { data: badge, error } = await supabase
          .from("badges")
          .insert({
            id: badgeId,
            membre_id: membre.id,
            equipe_id: equipeId,
            qr_code_url: qrUrl,
            envoye: false,
            type: 'participant'
          })
          .select()
          .single();

        if (error) throw error;
        badgesGeneres.push(badge);
      }

      // Stocker les badges pour le rendu PDF
      setParticipantBadgesForRender(prev => [...prev, ...badgesGeneres.map(b => ({ 
        id: b.id, 
        membre_id: b.membre_id, 
        equipe_id: b.equipe_id 
      }))]);

      // Générer tous les PDFs après un délai pour le rendu
      setTimeout(() => {
        badgesGeneres.forEach(badge => {
          const membre = membresToProcess.find(m => m.id === badge.membre_id);
          if (membre) {
            genererBadgePDF(membre, equipe, badge.id);
          }
        });
      }, 800);

      return badgesGeneres;
    },
    onSuccess: (data, variables) => {
      const equipe = equipesSelectionnees?.find(e => e.id === variables.equipeId);
      toast.success(`${data.length} badge(s) créé(s) pour ${equipe?.nom_equipe}`);
      queryClient.invalidateQueries({ queryKey: ["equipes-selectionnees"] });
      queryClient.invalidateQueries({ queryKey: ["all-badges"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de la génération: ${error.message}`);
    }
  });

  // Mutation pour générer un badge staff
  const genererStaffBadgeMutation = useMutation({
    mutationFn: async (staffData: typeof staffForm) => {
      const badgeId = crypto.randomUUID();
      const qrUrl = `${window.location.origin}/verification/${badgeId}`;

      const { data: badge, error } = await supabase
        .from("badges")
        .insert({
          id: badgeId,
          membre_id: null,
          equipe_id: null,
          qr_code_url: qrUrl,
          envoye: false,
          type: 'staff',
          staff_info: staffData
        })
        .select()
        .single();

      if (error) throw error;

      // Ajouter le badge staff au state pour le rendu
      setStaffBadgesForRender(prev => [...prev, { id: badgeId, staff_info: staffData }]);

      // Générer le PDF après un délai pour permettre le rendu
      setTimeout(() => {
        genererStaffBadgePDF(staffData, badgeId);
      }, 500);

      return badge;
    },
    onSuccess: () => {
      toast.success("Badge staff généré avec succès");
      setStaffForm({ nom_prenom: '', email: '', role: '', organisation: '' });
      queryClient.invalidateQueries({ queryKey: ["all-badges"] });
    },
    onError: (error) => {
      toast.error(`Erreur: ${error.message}`);
    }
  });

  // Initialiser EmailJS
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

  // Mutation pour envoyer des badges par email
  const envoyerBadgesMutation = useMutation({
    mutationFn: async ({ equipeId, membreIds }: { equipeId: string, membreIds?: string[] }) => {
      const equipe = equipesSelectionnees?.find(e => e.id === equipeId);
      if (!equipe) throw new Error("Équipe non trouvée");

      const membresToProcess = membreIds 
        ? equipe.membres.filter(m => membreIds.includes(m.id))
        : equipe.membres;

      const emailsEnvoyes = [];
      const erreurs = [];

      for (const membre of membresToProcess) {
        const badge = membre.badges?.[0];
        if (!badge || badge.envoye) {
          console.log(`Badge ignoré pour ${membre.email}: ${!badge ? 'non généré' : 'déjà envoyé'}`);
          continue;
        }

        // Validation de l'email
        if (!membre.email || membre.email.trim() === '') {
          console.error(`Email manquant pour le membre ${membre.nom_prenom} (ID: ${membre.id})`);
          console.log('Données complètes du membre:', membre);
          erreurs.push({ 
            email: 'N/A', 
            error: `Email manquant pour ${membre.nom_prenom}` 
          });
          continue;
        }

        try {
          console.log(`Début envoi email pour ${membre.nom_prenom} (${membre.email})...`);
          
          // Ajouter le badge au state pour le rendu (utilise le vrai badge.id)
          setParticipantBadgesForRender(prev => {
            // Vérifier si déjà présent
            if (prev.some(b => b.id === badge.id)) return prev;
            return [...prev, { id: badge.id, membre_id: membre.id, equipe_id: equipe.id }];
          });

          // Attendre que le DOM soit rendu
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Générer le PDF avec le bon ID de badge
          const element = badgeRefs.current[`badge-${badge.id}`];
          if (!element) {
            console.error(`Élément badge non trouvé pour badge ID: ${badge.id}`);
            continue;
          }

          console.log(`Génération PDF pour ${membre.nom_prenom}...`);
          
          // Forcer le reflow
          element.getBoundingClientRect();
          
          const canvas = await html2canvas(element, {
            backgroundColor: '#0B1F3A',
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: true,
            width: 400,
            height: 250,
            x: 0,
            y: 0,
            scrollX: 0,
            scrollY: -window.scrollY,
            windowWidth: 400,
            windowHeight: 250,
            onclone: (clonedDoc, clonedElement) => {
              if (clonedElement) {
                (clonedElement as HTMLElement).style.cssText = `
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  opacity: 1 !important;
                  display: block !important;
                  visibility: visible !important;
                  width: 400px !important;
                  height: 250px !important;
                  overflow: hidden !important;
                  background-color: #0B1F3A !important;
                `;
              }
              const allChildren = clonedElement?.querySelectorAll('*');
              allChildren?.forEach((child) => {
                const el = child as HTMLElement;
                if (el.style) {
                  el.style.opacity = '1';
                  el.style.visibility = 'visible';
                }
              });
            }
          });

          // Réduire la taille du canvas pour un PDF plus petit
          const scaleFactor = 0.5; // Réduire à 50%
          const smallCanvas = document.createElement('canvas');
          smallCanvas.width = canvas.width * scaleFactor;
          smallCanvas.height = canvas.height * scaleFactor;
          const ctx = smallCanvas.getContext('2d');
          ctx?.drawImage(canvas, 0, 0, smallCanvas.width, smallCanvas.height);

          const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: [105, 66],
            compress: true
          });
          
          // Utiliser JPEG avec compression pour réduire la taille
          const imgData = smallCanvas.toDataURL('image/jpeg', 0.7);
          pdf.addImage(imgData, 'JPEG', 0, 0, 105, 66);
          
          // Sauvegarder le PDF localement (pas d'upload)
          const pdfBase64 = pdf.output('datauristring').split(',')[1];
          
          // Vérifier la taille (limite EmailJS ~50KB)
          const sizeKB = Math.round(pdfBase64.length * 0.75 / 1024);
          console.log(`PDF généré: ${sizeKB}KB pour ${membre.email}`);

          // Lien de vérification
          const verificationUrl = `${window.location.origin}/verification/${badge.id}`;

          // Préparer les données pour EmailJS (sans pièce jointe si trop gros)
          const templateParams: any = {
            to_email: membre.email,
            to_name: membre.nom_prenom,
            nom_equipe: equipe.nom_equipe,
            role: membre.est_chef ? 'Chef de projet' : membre.role_equipe,
            date_event: '3 & 4 Avril 2026',
            lieu_event: 'ESMT Dakar, Sénégal',
            edition: '2ème Édition',
            badge_url: verificationUrl,
            verification_url: verificationUrl,
            recipient_email: membre.email,
            user_email: membre.email,
          };

          // Ajouter le PDF seulement s'il fait moins de 40KB (marge de sécurité)
          if (sizeKB < 40) {
            templateParams.badge_pdf = pdfBase64;
            console.log('PDF attaché à l\'email (taille OK)');
          } else {
            console.log('PDF trop gros, envoi avec lien uniquement');
          }

          console.log('TemplateParams EmailJS:', templateParams);

          // Envoyer l'email avec EmailJS
          const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
          );

          console.log(`EmailJS response pour ${membre.email}:`, response);
          
          if (response.status === 200) {
            // Mettre à jour le statut dans la base de données
            const { error: updateError } = await supabase
              .from("badges")
              .update({ 
                envoye: true, 
                date_envoi: new Date().toISOString() 
              })
              .eq('id', badge.id);

            if (updateError) {
              console.error(`Erreur mise à jour badge ${badge.id}:`, updateError);
              erreurs.push({ email: membre.email, error: `Mise à jour BD: ${updateError.message}` });
            } else {
              console.log(`Badge ${badge.id} marqué comme envoyé`);
              emailsEnvoyes.push(membre.email);
            }
          } else {
            throw new Error(`EmailJS status: ${response.status}`);
          }
          
        } catch (error) {
          console.error(`Erreur envoi email à ${membre.email}:`, error);
          erreurs.push({ email: membre.email, error: error.message });
        }
      }

      if (erreurs.length > 0) {
        console.error('Résumé des erreurs:', erreurs);
        throw new Error(`${erreurs.length} erreur(s) d'envoi. Premier: ${erreurs[0].error}`);
      }

      return emailsEnvoyes;
    },
    onSuccess: (emails, variables) => {
      const equipe = equipesSelectionnees?.find(e => e.id === variables.equipeId);
      toast.success(`${emails.length} email(s) envoyé(s) avec succès à l'équipe ${equipe?.nom_equipe}`);
      queryClient.invalidateQueries({ queryKey: ["equipes-selectionnees"] });
      queryClient.invalidateQueries({ queryKey: ["all-badges"] });
    },
    onError: (error) => {
      console.error('Erreur mutation envoi badges:', error);
      toast.error(`Erreur lors de l'envoi: ${error.message}`);
    }
  });

  // Mutation pour envoyer un badge staff par email
  const envoyerStaffBadgeMutation = useMutation({
    mutationFn: async (badge: any) => {
      const staffInfo = (badge as any).staff_info;
      if (!staffInfo?.email) {
        throw new Error(`Email manquant pour ${staffInfo?.nom_prenom || 'le membre staff'}`);
      }

      try {
        console.log(`Début envoi email staff pour ${staffInfo.nom_prenom} (${staffInfo.email})...`);

        // Ajouter le badge au state pour le rendu
        setStaffBadgesForRender(prev => [...prev, { id: badge.id, staff_info: staffInfo }]);

        // Attendre le rendu du DOM
        await new Promise(resolve => setTimeout(resolve, 800));

        const element = badgeRefs.current[`badge-staff-${badge.id}`];
        if (!element) {
          throw new Error(`Élément badge staff non trouvé pour ${badge.id}`);
        }

        // Forcer le reflow
        element.getBoundingClientRect();

        // Générer le PDF
        const canvas = await html2canvas(element, {
          backgroundColor: '#0B1F3A',
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: true,
          width: 400,
          height: 250,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: -window.scrollY,
          windowWidth: 400,
          windowHeight: 250,
          onclone: (clonedDoc, clonedElement) => {
            if (clonedElement) {
              (clonedElement as HTMLElement).style.cssText = `
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                opacity: 1 !important;
                display: block !important;
                visibility: visible !important;
                width: 400px !important;
                height: 250px !important;
                overflow: hidden !important;
                background-color: #0B1F3A !important;
              `;
            }
          }
        });

        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: [105, 66]
        });

        const imgData = canvas.toDataURL('image/png', 1.0);
        pdf.addImage(imgData, 'PNG', 0, 0, 105, 66);

        // Convertir en Blob pour upload
        const pdfArrayBuffer = pdf.output('arraybuffer');
        const pdfBlob = new Blob([pdfArrayBuffer], { type: 'application/pdf' });

        // Uploader sur Supabase Storage
        const fileName = `badge-staff-${badge.id}.pdf`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('badges')
          .upload(fileName, pdfBlob, {
            contentType: 'application/pdf',
            upsert: true
          });

        if (uploadError) {
          throw new Error(`Upload failed: ${uploadError.message}`);
        }

        // Générer l'URL publique
        const { data: { publicUrl } } = supabase.storage
          .from('badges')
          .getPublicUrl(fileName);

        // Envoyer l'email via EmailJS
        const templateParams = {
          to_email: staffInfo.email,
          to_name: staffInfo.nom_prenom,
          nom_equipe: staffInfo.organisation || 'Hackathon ISOC-ESMT',
          role: staffInfo.role,
          date_event: '3 & 4 Avril 2026',
          lieu_event: 'ESMT Dakar, Sénégal',
          edition: '2ème Édition',
          badge_url: publicUrl,
          recipient_email: staffInfo.email,
          user_email: staffInfo.email,
        };

        const response = await emailjs.send(
          EMAILJS_CONFIG.SERVICE_ID,
          EMAILJS_CONFIG.TEMPLATE_ID,
          templateParams
        );

        if (response.status === 200) {
          // Marquer comme envoyé
          await supabase
            .from("badges")
            .update({ 
              envoye: true, 
              date_envoi: new Date().toISOString() 
            })
            .eq('id', badge.id);

          return staffInfo.email;
        } else {
          throw new Error(`EmailJS status: ${response.status}`);
        }

      } catch (error) {
        console.error(`Erreur envoi email staff:`, error);
        throw error;
      }
    },
    onSuccess: (email) => {
      toast.success(`Badge envoyé à ${email}`);
      queryClient.invalidateQueries({ queryKey: ["all-badges"] });
    },
    onError: (error) => {
      toast.error(`Erreur lors de l'envoi: ${error.message}`);
    }
  });

  // Fonction pour générer le PDF d'un badge participant
  const genererBadgePDF = async (membre: any, equipe: any, badgeId: string) => {
    const element = badgeRefs.current[`badge-${badgeId}`];
    if (!element) {
      console.error(`Élément badge non trouvé pour badge ID: ${badgeId}`);
      toast.error(`Badge non trouvé pour ${membre.nom_prenom}`);
      return;
    }

    // Attendre que le DOM soit complètement rendu avec plusieurs frames
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Forcer le reflow/recalcul du layout
    element.getBoundingClientRect();

    try {
      console.log(`Capture badge pour ${membre.nom_prenom}...`);
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#0B1F3A',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: 400,
        height: 250,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: 400,
        windowHeight: 250,
        onclone: (clonedDoc, clonedElement) => {
          console.log('Clone créé, application des styles...');
          // Forcer tous les styles visibles sur le clone
          if (clonedElement) {
            (clonedElement as HTMLElement).style.cssText = `
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              opacity: 1 !important;
              display: block !important;
              visibility: visible !important;
              width: 400px !important;
              height: 250px !important;
              overflow: hidden !important;
              background-color: #0B1F3A !important;
            `;
          }
          // S'assurer que tous les enfants sont visibles
          const allChildren = clonedElement?.querySelectorAll('*');
          allChildren?.forEach((child) => {
            const el = child as HTMLElement;
            if (el.style) {
              el.style.opacity = '1';
              el.style.visibility = 'visible';
              el.style.display = el.tagName === 'DIV' || el.tagName === 'P' || el.tagName === 'SPAN' ? 'block' : el.style.display;
            }
          });
        }
      });

      console.log('Canvas créé, dimensions:', canvas.width, 'x', canvas.height);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [105, 66]
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 105, 66);
      pdf.save(`badge-${membre.nom_prenom.replace(/\s+/g, '-')}.pdf`);
      
      toast.success(`Badge généré pour ${membre.nom_prenom}`);
    } catch (error) {
      console.error("Erreur génération PDF:", error);
      toast.error(`Erreur lors de la génération du PDF pour ${membre.nom_prenom}`);
    }
  };

  // Fonction pour générer le PDF d'un badge staff
  const genererStaffBadgePDF = async (staffData: typeof staffForm, badgeId: string) => {
    const element = badgeRefs.current[`badge-staff-${badgeId}`];
    if (!element) {
      console.error(`Élément badge staff non trouvé pour ${badgeId}`);
      toast.error(`Badge staff non trouvé`);
      return;
    }

    // Attendre que le DOM soit complètement rendu
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Forcer le reflow/recalcul du layout
    element.getBoundingClientRect();

    try {
      console.log(`Capture badge staff pour ${staffData.nom_prenom}...`);
      
      const canvas = await html2canvas(element, {
        backgroundColor: '#0B1F3A',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: true,
        width: 400,
        height: 250,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: 400,
        windowHeight: 250,
        onclone: (clonedDoc, clonedElement) => {
          console.log('Clone staff créé, application des styles...');
          if (clonedElement) {
            (clonedElement as HTMLElement).style.cssText = `
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              opacity: 1 !important;
              display: block !important;
              visibility: visible !important;
              width: 400px !important;
              height: 250px !important;
              overflow: hidden !important;
              background-color: #0B1F3A !important;
            `;
          }
          const allChildren = clonedElement?.querySelectorAll('*');
          allChildren?.forEach((child) => {
            const el = child as HTMLElement;
            if (el.style) {
              el.style.opacity = '1';
              el.style.visibility = 'visible';
              el.style.display = el.tagName === 'DIV' || el.tagName === 'P' || el.tagName === 'SPAN' ? 'block' : el.style.display;
            }
          });
        }
      });

      console.log('Canvas staff créé, dimensions:', canvas.width, 'x', canvas.height);

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [105, 66]
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, 105, 66);
      pdf.save(`badge-${staffData.nom_prenom.replace(/\s+/g, '-')}.pdf`);
      
      toast.success(`Badge staff généré pour ${staffData.nom_prenom}`);
    } catch (error) {
      console.error("Erreur génération PDF staff:", error);
      toast.error(`Erreur lors de la génération du PDF pour ${staffData.nom_prenom}`);
    }
  };

  // Fonction pour télécharger un badge existant
  const telechargerBadge = async (badge: any) => {
    if ((badge as any).type === 'staff') {
      // Ajouter au state pour rendu
      setStaffBadgesForRender(prev => [...prev, { id: badge.id, staff_info: (badge as any).staff_info }]);
      setTimeout(() => {
        genererStaffBadgePDF((badge as any).staff_info, badge.id);
      }, 500);
    } else {
      const membre = badge.membre;
      const equipe = badge.equipe;
      // Ajouter au state pour rendu
      setParticipantBadgesForRender(prev => [...prev, { id: badge.id, membre_id: badge.membre_id, equipe_id: badge.equipe_id }]);
      setTimeout(() => {
        genererBadgePDF(membre, equipe, badge.id);
      }, 500);
    }
  };

  // Couleurs par rôle staff
  const ROLE_COLORS = {
    'Staff': { border: '#40B2A4', accent: '#40B2A4', pill: 'STAFF' },
    'Organisateur': { border: '#40B2A4', accent: '#40B2A4', pill: 'ORGANISATEUR' },
    'Mentor': { border: '#24366E', accent: '#24366E', pill: 'MENTOR' },
    'Jury': { border: '#7E245C', accent: '#7E245C', pill: 'JURY' },
    'Partenaire': { border: '#D25238', accent: '#D25238', pill: 'PARTENAIRE' },
    'Intervenant': { border: '#7E245C', accent: '#7E245C', pill: 'INTERVENANT' },
    'Invité': { border: '#6C757D', accent: '#6C757D', pill: 'INVITÉ' },
    'Presse': { border: '#D25238', accent: '#D25238', pill: 'PRESSE' },
  };

  // Filtrer les badges pour l'historique
  const filteredBadges = allBadges?.filter((badge) => {
    const matchesSearch = 
      badge.membre?.nom_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (badge as any).staff_info?.nom_prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (badge.equipe as any)?.nom_equipe?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'tous' || 
      (filterType === 'participants' && (badge as any).type === 'participant') ||
      (filterType === 'staff' && (badge as any).type === 'staff');
    
    const matchesStatus = filterStatus === 'tous' ||
      (filterStatus === 'envoyes' && badge.envoye) ||
      (filterStatus === 'non_envoyes' && !badge.envoye);

    return matchesSearch && matchesType && matchesStatus;
  });

  const toggleTeamExpansion = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const getTeamBadgeStatus = (equipe: any) => {
    const membresAvecBadges = equipe.membres.filter(m => m.badges && m.badges.length > 0);
    const membresEnvoyes = equipe.membres.filter(m => m.badges?.[0]?.envoye);
    
    if (membresAvecBadges.length === 0) return { status: 'non_genere', count: 0 };
    if (membresEnvoyes.length === equipe.membres.length) return { status: 'envoye', count: membresEnvoyes.length };
    return { status: 'genere', count: membresAvecBadges.length };
  };

  return (
    <AdminLayout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Badges</h1>
          <p className="text-gray-600">Générez et gérez les badges pour les participants et le staff</p>
        </div>

        {/* Navigation par sections */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveSection('participants')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeSection === 'participants'
                ? 'bg-white text-[#40B2A4] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Badges Participants
          </button>
          <button
            onClick={() => setActiveSection('staff')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeSection === 'staff'
                ? 'bg-white text-[#40B2A4] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Badges Staff
          </button>
          <button
            onClick={() => setActiveSection('historique')}
            className={`flex-1 px-4 py-2 rounded-md font-medium transition-colors ${
              activeSection === 'historique'
                ? 'bg-white text-[#40B2A4] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Clock className="w-4 h-4 inline mr-2" />
            Historique
          </button>
        </div>

        {/* Section 1: Badges Participants */}
        {activeSection === 'participants' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Badges Participants</h2>
                <p className="text-gray-600">Générez et envoyez les badges aux équipes sélectionnées</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    equipesSelectionnees?.forEach(equipe => {
                      genererBadgesMutation.mutate({ equipeId: equipe.id });
                    });
                  }}
                  disabled={genererBadgesMutation.isPending}
                  className="px-4 py-2 bg-[#40B2A4] text-white rounded-lg hover:bg-[#40B2A4]/90 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 inline mr-2 ${genererBadgesMutation.isPending ? 'animate-spin' : ''}`} />
                  Générer tous les badges
                </button>
                <button
                  onClick={() => {
                    // Éviter les envois multiples
                    if (envoyerBadgesMutation.isPending) {
                      toast.error('Envoi déjà en cours...');
                      return;
                    }
                    
                    const equipesAvecBadges = equipesSelectionnees?.filter(equipe => {
                      const status = getTeamBadgeStatus(equipe);
                      return status.status === 'genere';
                    }) || [];
                    
                    if (equipesAvecBadges.length === 0) {
                      toast.error('Aucun badge généré à envoyer');
                      return;
                    }
                    
                    // Envoyer équipe par équipe pour éviter les duplicatas
                    const envoyerSuivant = async (index: number) => {
                      if (index >= equipesAvecBadges.length) {
                        toast.success(`Tous les badges (${equipesAvecBadges.length} équipes) ont été envoyés !`);
                        return;
                      }
                      
                      const equipe = equipesAvecBadges[index];
                      try {
                        await envoyerBadgesMutation.mutateAsync({ equipeId: equipe.id });
                        setTimeout(() => envoyerSuivant(index + 1), 500); // Délai entre les envois
                      } catch (error) {
                        console.error(`Erreur équipe ${equipe.nom_equipe}:`, error);
                        setTimeout(() => envoyerSuivant(index + 1), 500);
                      }
                    };
                    
                    toast.info(`Début de l'envoi pour ${equipesAvecBadges.length} équipe(s)...`);
                    envoyerSuivant(0);
                  }}
                  disabled={envoyerBadgesMutation.isPending}
                  className="px-4 py-2 bg-[#40B2A4] text-white rounded-lg hover:bg-[#40B2A4]/90 transition-colors disabled:opacity-50"
                >
                  <Send className={`w-4 h-4 inline mr-2 ${envoyerBadgesMutation.isPending ? 'animate-pulse' : ''}`} />
                  {envoyerBadgesMutation.isPending ? 'Envoi en cours...' : 'Envoyer tous les badges'}
                </button>
              </div>
            </div>

            {isLoadingEquipes ? (
              <div className="text-center py-12">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#40B2A4]" />
                <p className="text-gray-600 mt-2">Chargement des équipes...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {equipesSelectionnees?.map((equipe) => {
                  const status = getTeamBadgeStatus(equipe);
                  const isExpanded = expandedTeams.has(equipe.id);
                  
                  return (
                    <motion.div
                      key={equipe.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-xl border border-gray-200 shadow-sm"
                    >
                      {/* Header de l'équipe */}
                      <div className="p-4 border-b border-gray-100">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={() => toggleTeamExpansion(equipe.id)}
                              className="p-1 hover:bg-gray-100 rounded"
                            >
                              {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>
                            <div>
                              <h3 className="font-semibold text-gray-900">{equipe.nom_equipe}</h3>
                              <p className="text-sm text-gray-600">{equipe.membres.length} membres</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status.status === 'envoye' 
                                ? 'bg-green-100 text-green-800'
                                : status.status === 'genere'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {status.status === 'envoye' && '✓ Badges envoyés'}
                              {status.status === 'genere' && `✓ ${status.count} badges générés`}
                              {status.status === 'non_genere' && 'Non générés'}
                            </span>
                            <button
                              onClick={() => genererBadgesMutation.mutate({ equipeId: equipe.id })}
                              disabled={genererBadgesMutation.isPending}
                              className="px-3 py-1 bg-[#40B2A4] text-white rounded-lg hover:bg-[#40B2A4]/90 transition-colors text-sm disabled:opacity-50"
                            >
                              Générer
                            </button>
                            <button
                              onClick={() => {
                                if (envoyerBadgesMutation.isPending) {
                                  toast.error('Envoi déjà en cours...');
                                  return;
                                }
                                envoyerBadgesMutation.mutate({ equipeId: equipe.id });
                              }}
                              disabled={status.status !== 'genere' || envoyerBadgesMutation.isPending}
                              className="px-3 py-1 bg-[#40B2A4] text-white rounded-lg hover:bg-[#40B2A4]/90 transition-colors text-sm disabled:opacity-50"
                            >
                              <Send className={`w-3 h-3 inline mr-1 ${envoyerBadgesMutation.isPending ? 'animate-pulse' : ''}`} />
                              {envoyerBadgesMutation.isPending ? 'Envoi...' : 'Envoyer'}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Liste des membres (expansible) */}
                      {isExpanded && (
                        <div className="p-4 space-y-2">
                          {equipe.membres.map((membre) => {
                            const badge = membre.badges?.[0];
                            return (
                              <div key={membre.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <div>
                                    <p className="font-medium text-gray-900">{membre.nom_prenom}</p>
                                    <p className="text-sm text-gray-600">
                                      {membre.est_chef ? 'Chef de projet' : membre.role_equipe}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-sm">
                                    {badge && (
                                      <span className="text-green-600">✓ Généré</span>
                                    )}
                                    {badge?.envoye && (
                                      <span className="text-blue-600 ml-2">✓ Envoyé</span>
                                    )}
                                    {!badge && (
                                      <span className="text-gray-400">—</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}

        {/* Section 2: Badges Staff */}
        {activeSection === 'staff' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Créer un badge spécial</h2>
              <p className="text-gray-600">Pour le staff, les partenaires et les invités</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom & Prénom *
                  </label>
                  <input
                    type="text"
                    value={staffForm.nom_prenom}
                    onChange={(e) => setStaffForm({ ...staffForm, nom_prenom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={staffForm.email}
                    onChange={(e) => setStaffForm({ ...staffForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                    placeholder="jean.dupont@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rôle *
                  </label>
                  <select
                    value={staffForm.role}
                    onChange={(e) => setStaffForm({ ...staffForm, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                  >
                    <option value="">Sélectionner un rôle</option>
                    {Object.keys(ROLE_COLORS).map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation (optionnel)
                  </label>
                  <input
                    type="text"
                    value={staffForm.organisation}
                    onChange={(e) => setStaffForm({ ...staffForm, organisation: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                    placeholder="ISOC ESMT"
                  />
                </div>
              </div>
              <button
                onClick={() => genererStaffBadgeMutation.mutate(staffForm)}
                disabled={!staffForm.nom_prenom || !staffForm.email || !staffForm.role || genererStaffBadgeMutation.isPending}
                className="mt-4 px-4 py-2 bg-[#40B2A4] text-white rounded-lg hover:bg-[#40B2A4]/90 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 inline mr-2 ${genererStaffBadgeMutation.isPending ? 'animate-spin' : ''}`} />
                Générer le badge
              </button>
            </div>
          </motion.div>
        )}

        {/* Section 3: Historique */}
        {activeSection === 'historique' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Historique des badges</h2>
              <p className="text-gray-600">Tous les badges générés et leur statut</p>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Rechercher par nom, équipe..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                  >
                    <option value="tous">Tous les types</option>
                    <option value="participants">Participants</option>
                    <option value="staff">Staff</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#40B2A4] focus:border-transparent"
                  >
                    <option value="tous">Tous les statuts</option>
                    <option value="envoyes">Envoyés</option>
                    <option value="non_envoyes">Non envoyés</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Tableau historique */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nom
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rôle
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Équipe
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Généré le
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Envoyé
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredBadges?.map((badge) => (
                      <tr key={badge.id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {badge.membre?.nom_prenom || (badge as any).staff_info?.nom_prenom}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {(badge as any).staff_info?.role || (badge.membre?.est_chef ? 'Chef de projet' : badge.membre?.role_equipe)}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {(badge.equipe as any)?.nom_equipe || '—'}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            (badge as any).type === 'staff'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {(badge as any).type === 'staff' ? 'Staff' : 'Participant'}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-600">
                          {new Date(badge.created_at).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          {badge.envoye ? (
                            <span className="text-green-600">✓ {new Date(badge.date_envoi!).toLocaleDateString('fr-FR')}</span>
                          ) : (
                            <span className="text-gray-400">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => telechargerBadge(badge)}
                              className="p-1 text-gray-600 hover:text-[#40B2A4] transition-colors"
                              title="Télécharger"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                            {(badge as any).type === 'staff' && !badge.envoye && (
                              <button
                                onClick={() => {
                                  if (envoyerStaffBadgeMutation.isPending) {
                                    toast.error('Envoi déjà en cours...');
                                    return;
                                  }
                                  envoyerStaffBadgeMutation.mutate(badge);
                                }}
                                disabled={envoyerStaffBadgeMutation.isPending}
                                className="p-1 text-gray-600 hover:text-[#40B2A4] transition-colors disabled:opacity-50"
                                title="Envoyer par email"
                              >
                                <Send className={`w-4 h-4 ${envoyerStaffBadgeMutation.isPending ? 'animate-pulse' : ''}`} />
                              </button>
                            )}
                            <button
                              onClick={() => window.open(`/verification/${badge.id}`, '_blank')}
                              className="p-1 text-gray-600 hover:text-[#40B2A4] transition-colors"
                              title="Vérifier"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* Badges pour la génération PDF - positionnés hors écran mais rendus */}
        <div style={{ position: 'absolute', left: '-9999px', top: '-9999px', opacity: 0, pointerEvents: 'none' }}>
          {/* Badges participants - Utiliser participantBadgesForRender pour avoir les bons IDs */}
          {participantBadgesForRender.map((badgeInfo) => {
            const equipe = equipesSelectionnees?.find(e => e.id === badgeInfo.equipe_id);
            const membre = equipe?.membres.find(m => m.id === badgeInfo.membre_id);
            if (!membre || !equipe) return null;
            return (
              <div
                key={`badge-${badgeInfo.id}`}
                id={`badge-${badgeInfo.id}`}
                ref={(el) => (badgeRefs.current[`badge-${badgeInfo.id}`] = el)}
                style={{
                  width: '400px',
                  height: '250px',
                  backgroundColor: '#0B1F3A',
                  borderRadius: '16px',
                  position: 'relative',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                {/* Ligne décorative en haut */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: '#FACC15'
                  }}
                />

                {/* Titre PARTICIPANT - Haut gauche */}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    right: '140px',
                  }}
                >
                  <p
                    style={{
                      color: '#FACC15',
                      fontSize: '38px',
                      fontWeight: 900,
                      margin: 0,
                      lineHeight: 1,
                      letterSpacing: '1px'
                    }}
                  >
                    PARTICIPANT
                  </p>
                </div>

                {/* Nom du participant - Sous le titre */}
                <div
                  style={{
                    position: 'absolute',
                    top: '72px',
                    left: '24px',
                    right: '140px',
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontSize: '22px',
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.2,
                      wordBreak: 'break-word'
                    }}
                  >
                    {membre.nom_prenom}
                  </p>
                  <p
                    style={{
                      color: '#A0AEC0',
                      fontSize: '12px',
                      fontWeight: 500,
                      margin: '4px 0 0 0'
                    }}
                  >
                    {equipe.type_candidature === 'individuel' ? 'Individuel' : equipe.nom_equipe}
                  </p>
                </div>

                {/* Infos événement - Plus bas */}
                <div
                  style={{
                    position: 'absolute',
                    top: '155px',
                    left: '24px',
                    right: '140px',
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 600,
                      margin: 0
                    }}
                  >
                    ISOC Innovation
                  </p>
                  <p
                    style={{
                      color: '#A0AEC0',
                      fontSize: '12px',
                      fontWeight: 400,
                      margin: '4px 0 0 0'
                    }}
                  >
                    Le 17 et 18 Avril 2026
                  </p>
                </div>

                {/* Logo Club ISOC ESMT - Bas gauche */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '24px'
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      margin: 0
                    }}
                  >
                    Club ISOC ESMT
                  </p>
                </div>

                {/* QR Code - Bas droite avec le bon ID */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '24px',
                    backgroundColor: '#FFFFFF',
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  <QRCodeSVG
                    value={`${window.location.origin}/verification/${badgeInfo.id}`}
                    size={65}
                    bgColor="#FFFFFF"
                    fgColor="#0B1F3A"
                    level="M"
                  />
                </div>
              </div>
            );
          })}

          {/* Badges staff */}
          {staffBadgesForRender.map((badge) => {
            const colors = ROLE_COLORS[(badge.staff_info as any).role as keyof typeof ROLE_COLORS] || ROLE_COLORS['Staff'];
            return (
              <div
                key={`badge-staff-${badge.id}`}
                id={`badge-staff-${badge.id}`}
                ref={(el) => (badgeRefs.current[`badge-staff-${badge.id}`] = el)}
                style={{
                  width: '400px',
                  height: '250px',
                  backgroundColor: '#0B1F3A',
                  borderRadius: '16px',
                  position: 'relative',
                  fontFamily: 'Arial, Helvetica, sans-serif',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                }}
              >
                {/* Ligne décorative en haut avec couleur rôle */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    backgroundColor: colors.accent
                  }}
                />

                {/* Titre rôle - Haut gauche */}
                <div
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    right: '140px',
                  }}
                >
                  <p
                    style={{
                      color: colors.accent,
                      fontSize: '34px',
                      fontWeight: 900,
                      margin: 0,
                      lineHeight: 1,
                      letterSpacing: '1px'
                    }}
                  >
                    {colors.pill}
                  </p>
                </div>

                {/* Nom staff - Sous le titre */}
                <div
                  style={{
                    position: 'absolute',
                    top: '72px',
                    left: '24px',
                    right: '140px',
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontSize: '22px',
                      fontWeight: 700,
                      margin: 0,
                      lineHeight: 1.2,
                      wordBreak: 'break-word'
                    }}
                  >
                    {(badge.staff_info as any).nom_prenom}
                  </p>
                  <p
                    style={{
                      color: '#A0AEC0',
                      fontSize: '12px',
                      fontWeight: 500,
                      margin: '4px 0 0 0'
                    }}
                  >
                    {(badge.staff_info as any).organisation || 'Hackathon ISOC-ESMT'}
                  </p>
                </div>

                {/* Infos événement - Plus bas */}
                <div
                  style={{
                    position: 'absolute',
                    top: '155px',
                    left: '24px',
                    right: '140px',
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 600,
                      margin: 0
                    }}
                  >
                    ISOC Innovation
                  </p>
                  <p
                    style={{
                      color: '#A0AEC0',
                      fontSize: '12px',
                      fontWeight: 400,
                      margin: '4px 0 0 0'
                    }}
                  >
                    Le 17 et 18 Avril 2026
                  </p>
                </div>

                {/* Logo Club ISOC ESMT - Bas gauche */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '24px'
                  }}
                >
                  <p
                    style={{
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 600,
                      margin: 0
                    }}
                  >
                    Club ISOC ESMT
                  </p>
                </div>

                {/* QR Code - Bas droite */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '24px',
                    backgroundColor: '#FFFFFF',
                    padding: '8px',
                    borderRadius: '8px'
                  }}
                >
                  <QRCodeSVG
                    value={`${window.location.origin}/verification/${badge.id}`}
                    size={65}
                    bgColor="#FFFFFF"
                    fgColor="#0B1F3A"
                    level="M"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
};

export default GestionBadges;
