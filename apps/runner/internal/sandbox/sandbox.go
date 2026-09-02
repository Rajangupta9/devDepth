package sandbox

import (
	"bytes"
	"context"
	"errors"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"
)

type ExecutionRequest struct {
	Language  string        `json:"language"` // "javascript", "python", "go"
	Code      string        `json:"code"`
	Input     string        `json:"input"`
	TimeoutMs time.Duration `json:"timeout_ms"`
}

type ExecutionResult struct {
	Stdout    string        `json:"stdout"`
	Stderr    string        `json:"stderr"`
	ExitCode  int           `json:"exit_code"`
	Runtime   time.Duration `json:"runtime_ms"`
	TimedOut  bool          `json:"timed_out"`
	ErrorText string        `json:"error_text,omitempty"`
}

type Sandbox struct {
	tempDir string
}

func NewSandbox() (*Sandbox, error) {
	dir, err := os.MkdirTemp("", "devdepth_runner_*")
	if err != nil {
		return nil, err
	}
	return &Sandbox{tempDir: dir}, nil
}

func (s *Sandbox) Close() {
	_ = os.RemoveAll(s.tempDir)
}

func (s *Sandbox) Execute(ctx context.Context, req ExecutionRequest) (*ExecutionResult, error) {
	if req.TimeoutMs <= 0 {
		req.TimeoutMs = 5000 * time.Millisecond
	}

	execCtx, cancel := context.WithTimeout(ctx, req.TimeoutMs)
	defer cancel()

	var cmd *exec.Cmd
	var filename string

	switch req.Language {
	case "javascript", "js", "node":
		filename = filepath.Join(s.tempDir, "solution.js")
		if err := os.WriteFile(filename, []byte(req.Code), 0644); err != nil {
			return nil, err
		}
		cmd = exec.CommandContext(execCtx, "node", filename)

	case "python", "py":
		filename = filepath.Join(s.tempDir, "solution.py")
		if err := os.WriteFile(filename, []byte(req.Code), 0644); err != nil {
			return nil, err
		}
		cmd = exec.CommandContext(execCtx, "python", filename)

	default:
		return nil, fmt.Errorf("unsupported execution language: %s", req.Language)
	}

	if req.Input != "" {
		cmd.Stdin = bytes.NewBufferString(req.Input)
	}

	var stdoutBuf, stderrBuf bytes.Buffer
	cmd.Stdout = &stdoutBuf
	cmd.Stderr = &stderrBuf

	startTime := time.Now()
	err := cmd.Run()
	elapsed := time.Since(startTime)

	result := &ExecutionResult{
		Stdout:   stdoutBuf.String(),
		Stderr:   stderrBuf.String(),
		Runtime:  elapsed,
		ExitCode: 0,
	}

	if execCtx.Err() == context.DeadlineExceeded {
		result.TimedOut = true
		result.ErrorText = "Execution Timed Out (Time Limit Exceeded)"
		result.ExitCode = 124
		return result, nil
	}

	if err != nil {
		var exitErr *exec.ExitError
		if errors.As(err, &exitErr) {
			result.ExitCode = exitErr.ExitCode()
		} else {
			result.ExitCode = 1
		}
		result.ErrorText = err.Error()
	}

	return result, nil
}
