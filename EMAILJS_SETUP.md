# Configuration EmailJS pour l'envoi de badges

## 📧 Étapes de configuration

### 1. Créer un compte EmailJS

1. Allez sur [https://www.emailjs.com/](https://www.emailjs.com/)
2. Créez un compte gratuit
3. Vérifiez votre adresse email

### 2. Créer un service email

1. Dans le dashboard EmailJS, cliquez sur "Email Services"
2. Choisissez votre provider (Gmail, Outlook, etc.)
3. Connectez votre compte email
4. Notez votre **SERVICE_ID**

### 3. Créer un template d'email

1. Allez dans "Email Templates"
2. Créez un nouveau template avec les variables suivantes :

**Template ID :** `template_badge`

**Variables requises :**
- `{{to_email}}` - Email du destinataire
- `{{to_name}}` - Nom du destinataire
- `{{equipe}}` - Nom de l'équipe
- `{{message}}` - Message personnalisé
- `{{badge_pdf}}` - PDF du badge en base64

**Exemple de template :**

```
Subject: Votre badge pour le Hackathon ISOC-ESMT 2026

Bonjour {{to_name}},

{{message}}

Cordialement,
L'équipe du Hackathon ISOC-ESMT 2026
```

### 4. Obtenir vos clés

1. Allez dans "Account" → "API Keys"
2. Notez votre **PUBLIC_KEY**

### 5. Mettre à jour le code

Dans `src/pages/admin/GestionBadges.tsx`, remplacez les valeurs :

```typescript
const EMAILJS_CONFIG = {
  SERVICE_ID: 'votre_service_id',     // Remplacez par votre SERVICE_ID
  TEMPLATE_ID: 'template_badge',      // Remplacez par votre TEMPLATE_ID
  PUBLIC_KEY: 'votre_public_key'      // Remplacez par votre PUBLIC_KEY
};
```

### 6. Installer EmailJS (déjà fait)

```bash
npm install @emailjs/browser
```

## 🔄 Test d'envoi

Pour tester l'envoi d'emails :

1. Générez un badge pour un participant
2. Cliquez sur "Envoyer"
3. Vérifiez que l'email est bien reçu

## 🛠️ Dépannage

### Email non reçu

1. Vérifiez le dossier spam/indésirables
2. Vérifiez que les variables du template sont correctes
3. Vérifiez les logs de la console pour les erreurs

### Erreur de configuration

1. Vérifiez que SERVICE_ID, TEMPLATE_ID et PUBLIC_KEY sont corrects
2. Assurez-vous que votre service email est connecté

### Template non trouvé

1. Vérifiez que le TEMPLATE_ID correspond exactement à celui dans EmailJS
2. Assurez-vous que le template contient toutes les variables requises

## 📝 Notes importantes

- EmailJS offre 200 emails gratuits par mois
- Pour plus d'emails, vous devrez passer à un plan payant
- Les pièces jointes (PDF) sont supportées avec le plan gratuit
- Testez toujours avec votre propre email avant de déployer

## 🔗 Liens utiles

- [Documentation EmailJS](https://www.emailjs.com/docs/)
- [Support EmailJS](https://www.emailjs.com/support)
- [Prix EmailJS](https://www.emailjs.com/pricing)
