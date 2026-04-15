package main

import (
	"encoding/json"
	"fmt"
	"math"
	"net/http"
)

type CalculationRequest struct {
	Operation string  `json:"operation"`
	A         float64 `json:"a"`
	B         float64 `json:"b"`
}

type CalculationResponse struct {
	Result float64 `json:"result,omitempty"`
	Error  string  `json:"error,omitempty"`
}

func calculateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CalculationRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(CalculationResponse{Error: "Invalid request payload"})
		return
	}

	var result float64
	var calcErr string

	switch req.Operation {
	case "add":
		result = req.A + req.B
	case "subtract":
		result = req.A - req.B
	case "multiply":
		result = req.A * req.B
	case "divide":
		if req.B == 0 {
			calcErr = "Division by zero"
		} else {
			result = req.A / req.B
		}
	case "power":
		result = math.Pow(req.A, req.B)
	case "sqrt":
		if req.A < 0 {
			calcErr = "Cannot calculate square root of a negative number"
		} else {
			result = math.Sqrt(req.A)
		}
	case "percentage":
		result = req.A / 100
	default:
		calcErr = "Invalid operation"
	}

	w.Header().Set("Content-Type", "application/json")
	if calcErr != "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(CalculationResponse{Error: calcErr})
		return
	}

	json.NewEncoder(w).Encode(CalculationResponse{Result: result})
}

func main() {
	http.HandleFunc("/api/calculate", calculateHandler)

	// Serve static files from the "dist" directory
	fs := http.FileServer(http.Dir("./dist"))
	http.Handle("/", fs)

	fmt.Println("Backend Go server starting on :8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		fmt.Printf("Server failed: %s\n", err)
	}
}
