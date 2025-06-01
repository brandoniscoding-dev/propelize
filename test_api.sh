#!/bin/bash

# Base URL de l'API
BASE_URL="http://localhost:3000"

# Fonction pour afficher les réponses
print_response() {
  echo "Réponse de $1 :"
  echo "$2" | jq .
  echo "----------------------------------------"
}

# 1. Inscription d'un admin
echo "Inscription de l'admin..."
ADMIN_REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","email":"admin@example.com","password":"admin123","role":"admin"}')
print_response "Inscription admin" "$ADMIN_REGISTER"

# 2. Inscription d'un utilisateur normal
echo "Inscription de l'utilisateur normal..."
USER_REGISTER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@example.com","password":"user123","role":"user"}')
print_response "Inscription user" "$USER_REGISTER"

# 3. Connexion de l'admin
echo "Connexion de l'admin..."
ADMIN_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}')
ADMIN_ACCESS_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.accessToken')
ADMIN_REFRESH_TOKEN=$(echo "$ADMIN_LOGIN" | jq -r '.refreshToken')
print_response "Connexion admin" "$ADMIN_LOGIN"

# 4. Connexion de l'utilisateur normal
echo "Connexion de l'utilisateur normal..."
USER_LOGIN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"user123"}')
USER_ACCESS_TOKEN=$(echo "$USER_LOGIN" | jq -r '.accessToken')
USER_REFRESH_TOKEN=$(echo "$USER_LOGIN" | jq -r '.refreshToken')
print_response "Connexion user" "$USER_LOGIN"

# 5. Mise à jour du profil de l'utilisateur normal
echo "Mise à jour du profil de l'utilisateur normal..."
USER_UPDATE=$(curl -s -X PUT "$BASE_URL/users/me" \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"newuser@example.com"}')
print_response "Mise à jour user" "$USER_UPDATE"

# 6. L'admin récupère la liste de tous les utilisateurs
echo "Récupération de tous les utilisateurs par l'admin..."
ALL_USERS=$(curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")
print_response "Liste utilisateurs" "$ALL_USERS"

# 7. L'admin met à jour le rôle de l'utilisateur normal
echo "Mise à jour du rôle de l'utilisateur par l'admin..."
ADMIN_UPDATE_USER=$(curl -s -X PUT "$BASE_URL/users/2" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"moderator"}')
print_response "Mise à jour rôle user" "$ADMIN_UPDATE_USER"

# 8. Création d'un véhicule par l'admin
echo "Création d'un véhicule par l'admin..."
VEHICLE1=$(curl -s -X POST "$BASE_URL/vehicles" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"vin":"ABC123","make":"Toyota","model":"Camry","rentalPrice":50}')
print_response "Création véhicule 1" "$VEHICLE1"

# 9. Création d'un second véhicule par l'admin
echo "Création d'un second véhicule par l'admin..."
VEHICLE2=$(curl -s -X POST "$BASE_URL/vehicles" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"vin":"XYZ789","make":"Honda","model":"Civic","rentalPrice":40}')
print_response "Création véhicule 2" "$VEHICLE2"

# 10. Mise à jour d'un véhicule par l'admin
echo "Mise à jour du véhicule 1 par l'admin..."
VEHICLE_UPDATE=$(curl -s -X PUT "$BASE_URL/vehicles/1" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"rentalPrice":60}')
print_response "Mise à jour véhicule 1" "$VEHICLE_UPDATE"

# 11. Recherche d'un véhicule par VIN par l'utilisateur normal
echo "Recherche d'un véhicule par VIN par l'utilisateur..."
VEHICLE_BY_VIN=$(curl -s -X GET "$BASE_URL/vehicles/vin/ABC123" \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN")
print_response "Recherche véhicule par VIN" "$VEHICLE_BY_VIN"

# 12. Récupération des véhicules par prix maximum par l'utilisateur
echo "Récupération des véhicules par prix maximum..."
VEHICLES_BY_PRICE=$(curl -s -X GET "$BASE_URL/vehicles/price/50" \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN")
print_response "Véhicules par prix max" "$VEHICLES_BY_PRICE"

# 13. Suppression d'un véhicule par l'admin
echo "Suppression du véhicule 2 par l'admin..."
VEHICLE_DELETE=$(curl -s -X DELETE "$BASE_URL/vehicles/2" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")
print_response "Suppression véhicule 2" "$VEHICLE_DELETE"

# 14. Déconnexion de l'utilisateur normal
echo "Déconnexion de l'utilisateur normal..."
USER_LOGOUT=$(curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN")
print_response "Déconnexion user" "$USER_LOGOUT"

# 15. Déconnexion de l'admin
echo "Déconnexion de l'admin..."
ADMIN_LOGOUT=$(curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $ADMIN_ACCESS_TOKEN")
print_response "Déconnexion admin" "$ADMIN_LOGOUT"

# 16. Rafraîchissement du token de l'admin
echo "Rafraîchissement du token de l'admin..."
ADMIN_REFRESH=$(curl -s -X POST "$BASE_URL/auth/refresh" \
  -H "Content-Type: application/json" \
  -d "{\"refreshToken\":\"$ADMIN_REFRESH_TOKEN\"}")
print_response "Rafraîchissement token admin" "$ADMIN_REFRESH"

# 17. Suppression du compte de l'utilisateur normal
echo "Suppression du compte de l'utilisateur normal..."
USER_DELETE=$(curl -s -X DELETE "$BASE_URL/users/me" \
  -H "Authorization: Bearer $USER_ACCESS_TOKEN")
print_response "Suppression compte user" "$USER_DELETE"

echo "Test terminé !"