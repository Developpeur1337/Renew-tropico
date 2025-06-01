# Bot Renew Tropico

![License](https://img.shields.io/badge/license-MIT-green)

## Description

**Bot Renew Tropico** est un bot Discord orienté gestion staff conçu pour faciliter la modération des serveurs.
Il propose la commande `/renew` permettant de supprimer puis recréer automatiquement le salon dans lequel elle est exécutée.

Idéal pour rafraîchir un salon problématique ou remettre à zéro ses messages, cette commande assure une recréation propre avec la conservation de toutes les propriétés importantes du salon (nom, topic, permissions, slowmode, NSFW, position dans la catégorie).

Sa philosophie repose sur la simplicité et l’efficacité via des commandes slash intuitives pour tous les rôles modérateurs et administrateurs.

Cette commande est réservée aux utilisateurs whitelistés et ne fonctionne que dans les catégories autorisées définies dans la configuration.

Le bot utilise exclusivement des **commandes slash** (full slash commands) pour une meilleure intégration et ergonomie.

---

## Fonctionnalités principales

- Vérifie que le salon est dans une catégorie autorisée (via `config.categorie`).
- Sauvegarde et recrée le salon avec :  
  - Nom  
  - Type  
  - Topic  
  - Permissions  
  - NSFW  
  - Slowmode  
  - Position  
- Supprime le salon original puis crée un nouveau identique.  
- Envoie un message dans le nouveau salon pour confirmer la réussite de la recréation.  
- Gestion d’erreurs avec réponse claire en cas de problème.  
- Restreint l’utilisation aux utilisateurs whitelistés.

## Crédits & Contact
Développé par Developpeur1337
Pour toute question, suggestion ou aide supplémentaire, contacte moi sur Discord : @developpeur1337

---

## Installation

1. Clone ce dépôt :

```bash
git clone https://github.com/Developpeur1337/Renew-tropico.git
cd Renew-tropico
npm install && node index.js
