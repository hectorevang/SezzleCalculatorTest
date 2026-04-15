import axios from "axios";

export type Operation = "add" | "subtract" | "multiply" | "divide" | "power" | "sqrt" | "percentage";

export interface CalculateResponse {
  result?: number;
  error?: string;
}

export const calculate = async (operation: Operation, a: number, b?: number): Promise<CalculateResponse> => {
  try {
    const response = await axios.post<CalculateResponse>("/api/calculate", {
      operation,
      a,
      b,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      return error.response.data;
    }
    return { error: "An unexpected error occurred" };
  }
};
