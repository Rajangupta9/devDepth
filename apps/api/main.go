package main

import (
	"context"
	"fmt"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"

	gopkgHttp "github.com/Rajangupta9/gopkg/pkg/http"
	"github.com/Rajangupta9/gopkg/pkg/middleware"
	"github.com/Rajangupta9/gopkg/pkg/utils/logger"
	"github.com/rajangupta9/pgkit/db"

	"devdepth/api/internal/auth"
	"devdepth/api/internal/courses"
	"devdepth/api/internal/problems"
	"devdepth/api/internal/submissions"
	"devdepth/api/internal/users"
)

func main() {
	ctx := context.Background()

	// Initialize structured logger from gopkg/pkg/utils/logger
	logger.InitLogger(nil, nil, "")
	logger.Info(ctx, "Starting DevDepth API Server", map[string]interface{}{
		"version":  "1.0.0",
		"env":      "development",
		"database": "PostgreSQL (pgkit)",
	})

	// Initialize PostgreSQL Client via github.com/rajangupta9/pgkit/db if DATABASE_URL is set
	var pgClient *db.Client
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL != "" {
		client, err := db.New(ctx, db.Config{},
			db.NamedPool{Name: "write", PoolConfig: db.PoolConfig{ConnString: dbURL}},
			db.NamedPool{Name: "read", PoolConfig: db.PoolConfig{ConnString: dbURL}},
		)
		if err != nil {
			logger.Warn(ctx, fmt.Sprintf("PostgreSQL connection via pgkit skipped/deferred: %v", err), nil)
		} else {
			pgClient = client
			defer pgClient.Close()
			logger.Info(ctx, "PostgreSQL connected via github.com/rajangupta9/pgkit/db pool", nil)
		}
	} else {
		logger.Info(ctx, "DATABASE_URL not set; running in-memory fallback for local development", nil)
	}

	// Setup Chi Mux
	mux := chi.NewRouter()

	// Apply gopkg HTTP middlewares
	mux.Use(middleware.Logging)
	mux.Use(middleware.RecoveryAndClean)
	mux.Use(middleware.CORS(middleware.DefaultCORSConfig()))

	// Instantiate Feature Layer Repositories, Services, and Handlers with pgkit Client
	userRepo := users.NewRepository(pgClient)
	userService := users.NewService(userRepo)
	userHandler := users.NewHandler(userService)

	authRepo := auth.NewRepository(pgClient)
	authService := auth.NewService(authRepo)
	authHandler := auth.NewHandler(authService)

	probRepo := problems.NewRepository(pgClient)
	probService := problems.NewService(probRepo)
	probHandler := problems.NewHandler(probService)

	courseRepo := courses.NewRepository(pgClient)
	courseService := courses.NewService(courseRepo)
	courseHandler := courses.NewHandler(courseService)

	subRepo := submissions.NewRepository(pgClient)
	subService := submissions.NewService(subRepo)
	subHandler := submissions.NewHandler(subService)

	// Define Open (Public) API Routes using gopkg RouteSpec
	openRoutes := []gopkgHttp.RouteSpec{
		{Method: "GET", Path: "/health", Handler: healthCheckHandler},
		{Method: "POST", Path: "/users/anonymous", Handler: userHandler.GetOrCreateAnonymous},
		{Method: "POST", Path: "/auth/register", Handler: authHandler.Register},
		{Method: "POST", Path: "/auth/login", Handler: authHandler.Login},
		{Method: "GET", Path: "/auth/profile", Handler: authHandler.GetProfile},
		{Method: "GET", Path: "/courses", Handler: courseHandler.List},
		{Method: "GET", Path: "/courses/detail", Handler: courseHandler.GetBySlug},
		{Method: "GET", Path: "/problems", Handler: probHandler.List},
		{Method: "GET", Path: "/problems/detail", Handler: probHandler.GetBySlug},
		{Method: "POST", Path: "/submissions/run", Handler: subHandler.Run},
		{Method: "POST", Path: "/submissions/submit", Handler: subHandler.Submit},
		{Method: "GET", Path: "/submissions/detail", Handler: subHandler.GetByID},
	}

	gopkgHttp.LoadOpenAPIs(openRoutes, mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	addr := fmt.Sprintf(":%s", port)
	logger.Info(ctx, fmt.Sprintf("DevDepth API listening on %s", addr), nil)

	if err := http.ListenAndServe(addr, mux); err != nil {
		logger.Fatal(ctx, "API Server failed to start", err, nil)
	}
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	gopkgHttp.Success(w, map[string]interface{}{
		"status":   "healthy",
		"service":  "DevDepth Backend API",
		"engine":   "Content + Visual + Practice Engine",
		"database": "PostgreSQL (github.com/rajangupta9/pgkit)",
	})
}
