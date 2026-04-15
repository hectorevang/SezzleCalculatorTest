package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCalculateHandler(t *testing.T) {
	tests := []struct {
		name           string
		payload        CalculationRequest
		expectedStatus int
		expectedResult float64
		expectedError  string
	}{
		{
			name:           "Addition",
			payload:        CalculationRequest{Operation: "add", A: 10, B: 5},
			expectedStatus: http.StatusOK,
			expectedResult: 15,
		},
		{
			name:           "Division by Zero",
			payload:        CalculationRequest{Operation: "divide", A: 10, B: 0},
			expectedStatus: http.StatusBadRequest,
			expectedError:  "Division by zero",
		},
		{
			name:           "Square Root",
			payload:        CalculationRequest{Operation: "sqrt", A: 25},
			expectedStatus: http.StatusOK,
			expectedResult: 5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.payload)
			req, _ := http.NewRequest("POST", "/api/calculate", bytes.NewBuffer(body))
			rr := httptest.NewRecorder()
			handler := http.HandlerFunc(calculateHandler)

			handler.ServeHTTP(rr, req)

			if rr.Code != tt.expectedStatus {
				t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, tt.expectedStatus)
			}

			var resp CalculationResponse
			json.NewDecoder(rr.Body).Decode(&resp)

			if tt.expectedError != "" {
				if resp.Error != tt.expectedError {
					t.Errorf("handler returned unexpected error: got %v want %v", resp.Error, tt.expectedError)
				}
			} else {
				if resp.Result != tt.expectedResult {
					t.Errorf("handler returned unexpected result: got %v want %v", resp.Result, tt.expectedResult)
				}
			}
		})
	}
}
