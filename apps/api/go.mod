module devdepth/api

go 1.25.0

require (
	github.com/Rajangupta9/gopkg v0.2.0
	github.com/go-chi/chi/v5 v5.2.4
	github.com/rajangupta9/pgkit v1.0.1
)

require (
	github.com/go-errors/errors v1.5.1 // indirect
	github.com/golang-jwt/jwt/v5 v5.3.0 // indirect
	github.com/google/uuid v1.6.0 // indirect
	github.com/jackc/pgpassfile v1.0.0 // indirect
	github.com/jackc/pgservicefile v0.0.0-20240606120523-5a60cdf6a761 // indirect
	github.com/jackc/pgx/v5 v5.9.2 // indirect
	github.com/jackc/puddle/v2 v2.2.2 // indirect
	go.uber.org/multierr v1.10.0 // indirect
	go.uber.org/zap v1.27.0 // indirect
	golang.org/x/sync v0.20.0 // indirect
	golang.org/x/text v0.36.0 // indirect
)

replace (
	github.com/Rajangupta9/gopkg => ../../infra/gopkg
	github.com/rajangupta9/pgkit => ../../infra/pgkit
)
