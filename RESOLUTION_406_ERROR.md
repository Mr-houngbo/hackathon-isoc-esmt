# Instructions pour résoudre l'erreur 406 (Not Acceptable)

## Problème
L'erreur 406 lors de l'accès à la table `notes` indique que la table n'existe probablement pas dans votre base de données Supabase.

## Solution immédiate

### 1. Exécuter ce script dans la console SQL Supabase

Allez dans votre projet Supabase → SQL Editor et exécutez le contenu du fichier `create_notes_table.sql`.

### 2. Vérifier que la table existe

Après exécution, vérifiez avec :
```sql
SELECT * FROM notes LIMIT 1;
```

### 3. Si l'erreur persiste

Vérifiez que les permissions sont correctes :
```sql
GRANT ALL ON notes TO anon;
GRANT ALL ON notes TO authenticated;
```

## Étapes détaillées

1. **Connectez-vous à Supabase Dashboard**
2. **Allez dans SQL Editor** (menu de gauche)
3. **Copiez-collez** le contenu de `create_notes_table.sql`
4. **Cliquez sur "Run"**
5. **Vérifiez** que la table est créée avec succès

## Test

Après création, rechargez votre application et essayez d'accéder à un dossier. L'erreur 406 devrait disparaître.

## Si ça ne fonctionne pas

Contactez-moi pour que je puisse vous aider à :
- Vérifier la structure exacte de votre base de données
- Créer les tables manquantes
- Configurer les permissions correctement
