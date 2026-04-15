import { useState } from "react";
import { motion } from "motion/react";
import { Delete, Divide, Equal, Minus, Percent, Plus, RotateCcw, X } from "lucide-react";
import { calculate, Operation } from "./services/calculatorService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function App() {
  const [display, setDisplay] = useState("0");
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [currentOperation, setCurrentOperation] = useState<Operation | null>(null);
  const [isWaitingForOperand, setIsWaitingForOperand] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    if (error) clearAll();
    
    if (isWaitingForOperand) {
      setDisplay(num);
      setIsWaitingForOperand(false);
    } else {
      setDisplay(display === "0" ? num : display + num);
    }
  };

  const handleDot = () => {
    if (error) clearAll();
    if (isWaitingForOperand) {
      setDisplay("0.");
      setIsWaitingForOperand(false);
    } else if (!display.includes(".")) {
      setDisplay(display + ".");
    }
  };

  const clearAll = () => {
    setDisplay("0");
    setPreviousValue(null);
    setCurrentOperation(null);
    setIsWaitingForOperand(false);
    setError(null);
  };

  const handleOperation = async (op: Operation) => {
    if (error) return;

    const currentValue = parseFloat(display);

    if (op === "sqrt" || op === "percentage") {
      const response = await calculate(op, currentValue);
      if (response.error) {
        setError(response.error);
        setDisplay("Error");
      } else if (response.result !== undefined) {
        setDisplay(response.result.toString());
      }
      return;
    }

    if (previousValue === null) {
      setPreviousValue(currentValue);
    } else if (currentOperation) {
      const response = await calculate(currentOperation, previousValue, currentValue);
      if (response.error) {
        setError(response.error);
        setDisplay("Error");
        return;
      } else if (response.result !== undefined) {
        setPreviousValue(response.result);
        setDisplay(response.result.toString());
      }
    }

    setCurrentOperation(op);
    setIsWaitingForOperand(true);
  };

  const handleEqual = async () => {
    if (error || !currentOperation || previousValue === null) return;

    const currentValue = parseFloat(display);
    const response = await calculate(currentOperation, previousValue, currentValue);

    if (response.error) {
      setError(response.error);
      setDisplay("Error");
    } else if (response.result !== undefined) {
      setDisplay(response.result.toString());
      setPreviousValue(null);
      setCurrentOperation(null);
      setIsWaitingForOperand(true);
    }
  };

  const buttons = [
    { label: "C", action: clearAll, className: "bg-[#EF4444] hover:bg-red-600", icon: <RotateCcw className="w-5 h-5" /> },
    { label: "√", action: () => handleOperation("sqrt"), className: "bg-[#F59E0B] hover:bg-amber-600" },
    { label: "^", action: () => handleOperation("power"), className: "bg-[#F59E0B] hover:bg-amber-600" },
    { label: "%", action: () => handleOperation("percentage"), className: "bg-[#F59E0B] hover:bg-amber-600", icon: <Percent className="w-5 h-5" /> },
    
    { label: "7", action: () => handleNumber("7"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "8", action: () => handleNumber("8"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "9", action: () => handleNumber("9"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "÷", action: () => handleOperation("divide"), className: "bg-[#F59E0B] hover:bg-amber-600", icon: <Divide className="w-5 h-5" /> },
    
    { label: "4", action: () => handleNumber("4"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "5", action: () => handleNumber("5"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "6", action: () => handleNumber("6"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "×", action: () => handleOperation("multiply"), className: "bg-[#F59E0B] hover:bg-amber-600", icon: <X className="w-5 h-5" /> },
    
    { label: "1", action: () => handleNumber("1"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "2", action: () => handleNumber("2"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "3", action: () => handleNumber("3"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: "−", action: () => handleOperation("subtract"), className: "bg-[#F59E0B] hover:bg-amber-600", icon: <Minus className="w-5 h-5" /> },
    
    { label: "0", action: () => handleNumber("0"), className: "bg-[#334155] hover:bg-slate-600" },
    { label: ".", action: handleDot, className: "bg-[#334155] hover:bg-slate-600" },
    { label: "=", action: handleEqual, className: "bg-[#10B981] hover:bg-emerald-600", icon: <Equal className="w-5 h-5" /> },
    { label: "+", action: () => handleOperation("add"), className: "bg-[#F59E0B] hover:bg-amber-600", icon: <Plus className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#4F46E5] flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[960px] h-auto lg:h-[680px] bg-white rounded-[24px] grid grid-cols-1 lg:grid-cols-[320px_1fr] overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
      >
        {/* Sidebar */}
        <aside className="bg-[#EEF2FF] p-10 border-r border-black/5 flex flex-col justify-between">
          <div className="sidebar-top">
            <div className="inline-block px-3 py-1 rounded-full bg-[#DBEAFE] text-[#1E40AF] text-[11px] font-bold uppercase mb-8">
              Test Environment v1.0
            </div>
            <h1 className="text-2xl font-extrabold text-[#4F46E5] mb-2 tracking-tight">Sezzle Calc</h1>
            <p className="text-sm text-[#64748B] leading-relaxed mb-8">
              Full-stack arithmetic engine powered by a Go microservice and React frontend.
            </p>
            
            <ul className="space-y-4">
              {[
                "Basic & Advanced Math",
                "REST API Validation",
                "Percentage Calculation",
                "Exponentiation Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center text-[13px] font-medium text-[#1E293B]">
                  <div className="w-[18px] h-[18px] bg-[#4F46E5] rounded-[4px] mr-3 flex items-center justify-center text-white text-[10px]">
                    ✓
                  </div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="sidebar-bottom mt-12 lg:mt-0">
            <div className="mb-3 text-[11px] font-bold text-[#94A3B8] tracking-wider uppercase">CORE STACK</div>
            <div className="flex flex-wrap gap-2">
              {["React", "TypeScript", "Go", "Docker"].map(tech => (
                <span key={tech} className="px-2 py-1 bg-[#E2E8F0] rounded-[4px] text-[10px] font-semibold text-[#475569]">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex items-center justify-center bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] p-8">
          <div className="w-full max-w-[340px] bg-[#1E293B] rounded-[32px] p-6 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.2)] border border-white/10">
            {/* Screen */}
            <div className="bg-[#0F172A] rounded-[16px] p-5 text-right mb-6 border border-white/5 min-h-[100px] flex flex-col justify-end">
              <div className="font-mono text-sm text-[#64748B] mb-1 min-h-[20px]">
                {currentOperation && previousValue !== null ? (
                  `${previousValue} ${currentOperation === "add" ? "+" : 
                                     currentOperation === "subtract" ? "-" : 
                                     currentOperation === "multiply" ? "×" : 
                                     currentOperation === "divide" ? "÷" : 
                                     currentOperation === "power" ? "^" : ""}`
                ) : ""}
              </div>
              <div className={cn(
                "font-mono text-4xl text-[#F8FAFC] font-medium tracking-tighter break-all",
                error ? "text-red-400 text-xl" : ""
              )}>
                {error || display}
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-4 gap-3">
              {buttons.map((btn, idx) => (
                <Button
                  key={idx}
                  onClick={btn.action}
                  className={cn(
                    "h-[60px] rounded-[14px] text-lg font-semibold text-white border-none transition-all active:scale-95",
                    btn.className
                  )}
                >
                  {btn.icon || btn.label}
                </Button>
              ))}
            </div>

            <div className="mt-5 text-center text-[10px] text-[#475569] font-bold tracking-[1px] uppercase">
              Connection: 200 OK
            </div>
          </div>
        </main>
      </motion.div>
    </div>
  );
}
