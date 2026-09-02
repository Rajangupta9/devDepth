package auth

import (
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"strings"
	"time"
)

var (
	ErrInvalidToken   = errors.New("invalid authorization token format")
	ErrExpiredToken   = errors.New("authorization token has expired")
	ErrInvalidSignature = errors.New("authorization token signature verification failed")
)

type JWTClaims struct {
	UserID    string `json:"sub"`
	Email     string `json:"email"`
	Role      string `json:"role"`
	IssuedAt  int64  `json:"iat"`
	ExpiresAt int64  `json:"exp"`
}

func getJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "devdepth_production_jwt_secret_key_2026_v1_super_secure_987654321"
	}
	return []byte(secret)
}

// GenerateJWT creates a cryptographically signed HMAC-SHA256 JWT token
func GenerateJWT(userID string, email string, role string) (string, int64, error) {
	now := time.Now().Unix()
	expiresIn := int64(7 * 24 * 3600) // 7 days expiration in seconds
	expiresAt := now + expiresIn

	header := map[string]string{
		"alg": "HS256",
		"typ": "JWT",
	}

	headerJSON, err := json.Marshal(header)
	if err != nil {
		return "", 0, fmt.Errorf("failed to marshal token header: %w", err)
	}

	claims := JWTClaims{
		UserID:    userID,
		Email:     email,
		Role:      role,
		IssuedAt:  now,
		ExpiresAt: expiresAt,
	}

	claimsJSON, err := json.Marshal(claims)
	if err != nil {
		return "", 0, fmt.Errorf("failed to marshal token claims: %w", err)
	}

	encodedHeader := base64.RawURLEncoding.EncodeToString(headerJSON)
	encodedClaims := base64.RawURLEncoding.EncodeToString(claimsJSON)

	unsignedToken := fmt.Sprintf("%s.%s", encodedHeader, encodedClaims)
	signature := computeHMACSHA256(unsignedToken, getJWTSecret())
	encodedSignature := base64.RawURLEncoding.EncodeToString(signature)

	signedJWT := fmt.Sprintf("%s.%s", unsignedToken, encodedSignature)
	return signedJWT, expiresIn, nil
}

// ValidateJWT verifies the cryptographic signature & expiration of a JWT token string
func ValidateJWT(tokenStr string) (*JWTClaims, error) {
	parts := strings.Split(tokenStr, ".")
	if len(parts) != 3 {
		return nil, ErrInvalidToken
	}

	unsignedToken := fmt.Sprintf("%s.%s", parts[0], parts[1])
	providedSignature, err := base64.RawURLEncoding.DecodeString(parts[2])
	if err != nil {
		return nil, ErrInvalidToken
	}

	expectedSignature := computeHMACSHA256(unsignedToken, getJWTSecret())
	if !hmac.Equal(providedSignature, expectedSignature) {
		return nil, ErrInvalidSignature
	}

	claimsJSON, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return nil, ErrInvalidToken
	}

	var claims JWTClaims
	if err := json.Unmarshal(claimsJSON, &claims); err != nil {
		return nil, ErrInvalidToken
	}

	if time.Now().Unix() > claims.ExpiresAt {
		return nil, ErrExpiredToken
	}

	return &claims, nil
}

func computeHMACSHA256(message string, secret []byte) []byte {
	h := hmac.New(sha256.New, secret)
	h.Write([]byte(message))
	return h.Sum(nil)
}
