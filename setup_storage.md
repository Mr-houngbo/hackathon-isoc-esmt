# Configuration Supabase Storage pour les Uploads d'Images

## 📋 Étapes à suivre

### 1. Exécuter le script SQL dans la console Supabase

1. Allez dans votre projet Supabase : https://supabase.com/dashboard
2. Cliquez sur votre projet `nhehodutvpwdfgrvwohh`
3. Dans le menu de gauche, allez dans **SQL Editor**
4. Copiez et collez le contenu du fichier : `supabase/migrations/20240320_create_storage_buckets.sql`
5. Cliquez sur **Run** pour exécuter le script

### 2. Vérifier la création des buckets

Après exécution, vous devriez voir ces buckets dans **Storage** :
- ✅ `uploads` - Bucket général
- ✅ `mentors` - Photos des mentors
- ✅ `partenaires` - Logos des partenaires  
- ✅ `galerie` - Images de la galerie

### 3. Permissions configurées automatiquement

Le script configure aussi les politiques d'accès :
- 📖 **Lecture publique** : Tout le monde peut voir les images
- ✍️ **Upload authentifié** : Seuls les utilisateurs connectés peuvent uploader
- 🗑️ **Suppression authentifiée** : Seuls les utilisateurs connectés peuvent supprimer

### 4. Tester l'upload

Une fois le script exécuté, vous pouvez tester :
1. Allez dans l'admin : http://localhost:5173/admin/mentors
2. Cliquez sur "Ajouter un mentor"
3. Essayez d'uploader une photo
4. L'image devrait apparaître dans le bucket correspondant

## 🔧 Fonctionnalités du composant ImageUpload

### ✨ Caractéristiques
- **Drag & Drop** : Glissez-déposez des images
- **Click to upload** : Cliquez pour sélectionner un fichier
- **Preview** : Aperçu immédiat de l'image
- **Validation** : Vérifie le type et la taille (max 5MB)
- **Loading** : Indicateur de progression
- **Replace/Delete** : Changez ou supprimez l'image

### 📁 Buckets organisés
- `mentors/photos/` - Photos des mentors et jury
- `partenaires/logos/` - Logos des partenaires
- `galerie/medias/` - Images de la galerie
- `uploads/images/` - Uploads généraux

### 🛡️ Sécurité
- Noms de fichiers uniques (timestamp + random)
- Validation des MIME types
- Limitation de taille
- Politiques d'accès Supabase

## 🚀 Utilisation

Le composant est maintenant intégré dans :
- ✅ `GestionMentors.tsx` - Upload photos mentors
- ✅ `GestionPartenaires.tsx` - Upload logos partenaires  
- ✅ `GestionGalerie.tsx` - Upload images galerie

Plus besoin d'URLs externes ! 🎉
