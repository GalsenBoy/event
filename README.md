📄 README — Application AVANTI
📌 Description
Cette application mobile, développée avec React Native, Expo et Supabase, permet :

De créer et gérer des événements (privés ou publics)

De rejoindre des groupes et interagir via une carte des événements

De discuter entre utilisateurs (chat en temps réel)

D’afficher et filtrer les événements par type, date, ville et tarif

D’intégrer des événements externes via l’API Eventbrite (en cours de développement)

🛠️ Stack technique
Framework mobile : React Native + Expo

Backend / BDD : Supabase (PostgreSQL + Auth + Storage + RLS)

Gestion d’état : Zustand

Requêtes / Data Fetching : React Query

Navigation : React Router Native

Localisation : expo-location

API externe : Eventbrite API

```bash
📦 app
 ┣ 📂 home
 ┃ ┗ 📂 components
 ┃    ┗ 📜 CardHome.tsx      # Carte événement
 ┣ 📂 chat                   # Écrans de messagerie
 ┣ 📂 profile                # Gestion des profils utilisateurs
 ┣ 📂 events                 # Pages de création / liste d'événements
 ┣ 📜 App.tsx                 # Entrée principale
📦 hooks                     # Hooks personnalisés (useSavedEvents, etc.)
📦 components
 ┣ 📂 ui                     # Composants réutilisables (Loading, Modal, etc.)
📦 services
 ┣ 📜 supabase.ts            # Initialisation Supabase
 ┣ 📜 eventbrite.ts          # Requêtes vers API Eventbrite
📦 types                     # Types TypeScript
.env                         # Variables d’environnement
```
⚙️ Installation
Cloner le projet
```bash
git clone https://github.com/ton-repo/app-events.git
cd app-events
```
Installer les dépendances
```bash
npm install
# ou
yarn install
```
Configurer les variables d’environnement
Créer un fichier .env à la racine :
```bash
EXPO_PUBLIC_SUPABASE_URL=ton_url_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=ta_cle_supabase
EXPO_PUBLIC_EVENTBRITE_TOKEN=ton_token_eventbrite
```
Lancer l’application
```bash
npx expo start
```
📡 API Supabase
Tables principales :

profiles : infos utilisateurs (avatar, bio, etc.)

events : événements créés

conversations : liste des conversations (chat)

messages : messages envoyés/reçus

saved_events : événements enregistrés par un utilisateur

RLS activées :
Chaque table possède des règles de sécurité pour que les utilisateurs ne voient que leurs données ou les événements publics.

