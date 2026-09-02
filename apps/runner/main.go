package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/go-chi/chi/v5"

	gopkgHttp "github.com/Rajangupta9/gopkg/pkg/http"
	"github.com/Rajangupta9/gopkg/pkg/middleware"
	"github.com/Rajangupta9/gopkg/pkg/utils/logger"

	"devdepth/runner/internal/sandbox"
)

func main() {
	ctx := context.Background()

	logger.InitLogger(nil, nil, "")
	logger.Info(ctx, "Starting DevDepth Execution Runner Microservice", map[string]interface{}{
		"version": "1.0.0",
		"env":     "development",
	})

	mux := chi.NewRouter()
	mux.Use(middleware.Logging)
	mux.Use(middleware.RecoveryAndClean)
	mux.Use(middleware.CORS(middleware.DefaultCORSConfig()))

	routes := []gopkgHttp.RouteSpec{
		{Method: "GET", Path: "/health", Handler: healthCheckHandler},
		{Method: "POST", Path: "/execute", Handler: executeCodeHandler},
	}

	gopkgHttp.LoadOpenAPIs(routes, mux)

	port := os.Getenv("RUNNER_PORT")
	if port == "" {
		port = "8081"
	}

	addr := fmt.Sprintf(":%s", port)
	logger.Info(ctx, fmt.Sprintf("DevDepth Execution Runner listening on %s", addr), nil)

	if err := http.ListenAndServe(addr, mux); err != nil {
		logger.Fatal(ctx, "Runner Service failed to start", err, nil)
	}
}

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
	gopkgHttp.Success(w, map[string]interface{}{
		"status":  "healthy",
		"service": "DevDepth Practice Engine Sandbox Runner",
	})
}

func executeCodeHandler(w http.ResponseWriter, r *http.Request) {
	var req sandbox.ExecutionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		gopkgHttp.BadRequest(w, "Invalid execution payload")
		return
	}

	box, err := sandbox.NewSandbox()
	if err != nil {
		gopkgHttp.InternalError(w, fmt.Sprintf("Failed to initialize execution sandbox: %v", err))
		return
	}
	defer box.Close()

	if req.TimeoutMs <= 0 {
		req.TimeoutMs = 5000 * time.Millisecond
	}

	result, err := box.Execute(r.Context(), req)
	if err != nil {
		gopkgHttp.InternalError(w, fmt.Sprintf("Execution error: %v", err))
		return
	}

	gopkgHttp.Success(w, result)
}
