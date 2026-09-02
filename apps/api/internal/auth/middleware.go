package auth

import (
	"context"
	"net/http"
	"strings"

	gopkgHttp "github.com/Rajangupta9/gopkg/pkg/http"
)

type contextKey string

const (
	UserIDKey    contextKey = "user_id"
	UserEmailKey contextKey = "user_email"
	UserRoleKey  contextKey = "user_role"
)

// AuthMiddleware validates JWT Bearer tokens from incoming Authorization headers
func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			authHeader = r.Header.Get("X-Auth-Token")
		}

		if authHeader == "" {
			gopkgHttp.Unauthorized(w, "Missing authorization token header")
			return
		}

		tokenStr := strings.TrimPrefix(authHeader, "Bearer ")
		tokenStr = strings.TrimSpace(tokenStr)

		claims, err := ValidateJWT(tokenStr)
		if err != nil {
			gopkgHttp.Unauthorized(w, err.Error())
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
		ctx = context.WithValue(ctx, UserEmailKey, claims.Email)
		ctx = context.WithValue(ctx, UserRoleKey, claims.Role)

		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
