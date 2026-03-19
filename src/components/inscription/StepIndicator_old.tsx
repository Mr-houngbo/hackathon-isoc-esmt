import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

const StepIndicator = ({ currentStep, totalSteps, labels }: StepIndicatorProps) => (
  <div className="mb-12">
    {/* Mobile progress bar */}
    <div className="md:hidden mb-6">
      <div className="flex items-center justify-between mb-3">
        <span 
          className="text-sm font-semibold text-[#F9FAFB]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Étape {currentStep + 1}/{totalSteps}
        </span>
        <span className="text-xs text-[#9CA3AF]">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full h-2 bg-[#1F2937] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#00873E] to-[#FBBF24]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <p 
        className="text-sm text-[#FBBF24] mt-2 text-center"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {labels[currentStep]}
      </p>
    </div>

    {/* Desktop step indicator */}
    <div className="hidden md:block">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-5 h-0.5 bg-[#1F2937] z-0"></div>
        
        {/* Progress line */}
        <motion.div
          className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-[#00873E] to-[#FBBF24] z-0"
          initial={{ width: 0 }}
          animate={{ width: `${(currentStep / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        
        {Array.from({ length: totalSteps }, (_, i) => (
          <div key={i} className="flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{
                scale: i === currentStep ? 1.1 : 1,
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              {/* Step circle */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                  i < currentStep 
                    ? 'bg-[#00873E] border-[#00873E] text-[#F9FAFB]' 
                    : i === currentStep 
                      ? 'bg-[#0A0A0A] border-[#FBBF24] text-[#FBBF24] shadow-lg shadow-[#FBBF24]/25' 
                      : 'bg-[#111827] border-[#2D3748] text-[#9CA3AF]'
                }`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {i < currentStep ? (
                  <CheckCircle size={18} className="text-[#F9FAFB]" />
                ) : (
                  i + 1
                )}
              </div>
              
              {/* Glow effect for current step */}
              {i === currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#FBBF24] opacity-20 blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            {/* Step label */}
            <div className="mt-4 text-center max-w-[100px]">
              <p 
                className={`text-xs font-medium transition-colors duration-300 ${
                  i <= currentStep ? 'text-[#F9FAFB]' : 'text-[#9CA3AF]'
                }`}
                style={{ fontFamily: 'DM Sans, sans-serif' }}
              >
                {labels[i]}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Step description */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mt-8 text-center"
      >
        <p 
          className="text-lg text-[#F9FAFB] font-semibold"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {labels[currentStep]}
        </p>
        <p 
          className="text-sm text-[#9CA3AF] mt-1"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          {currentStep + 1} sur {totalSteps} étapes
        </p>
      </motion.div>
    </div>
  </div>
);

export default StepIndicator;
