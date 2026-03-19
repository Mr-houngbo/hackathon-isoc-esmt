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
          className="text-sm font-semibold text-[#212529]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Étape {currentStep + 1}/{totalSteps}
        </span>
        <span className="text-xs text-[#6C757D]">{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
      </div>
      <div className="w-full h-3 bg-[#E9ECEF] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F]"
          initial={{ width: 0 }}
          animate={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
      <p 
        className="text-sm text-[#1E3A5F] mt-2 text-center"
        style={{ fontFamily: 'DM Sans, sans-serif' }}
      >
        {labels[currentStep]}
      </p>
    </div>

    {/* Desktop step indicator */}
    <div className="hidden md:block">
      <div className="flex items-center justify-between relative">
        {/* Background line */}
        <div className="absolute left-0 right-0 top-5 h-1 bg-[#E9ECEF] z-0"></div>
        
        {/* Progress line */}
        <motion.div
          className="absolute left-0 top-5 h-1 bg-gradient-to-r from-[#FF6B35] to-[#1E3A5F] z-0"
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
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-bold transition-all duration-300 ${
                  i < currentStep 
                    ? 'bg-[#FF6B35] border-[#FF6B35] text-white' 
                    : i === currentStep 
                      ? 'bg-white border-[#1E3A5F] text-[#1E3A5F] shadow-lg shadow-[#1E3A5F]/25' 
                      : 'bg-white border-[#E9ECEF] text-[#6C757D]'
                }`}
                style={{ fontFamily: 'Sora, sans-serif' }}
              >
                {i < currentStep ? (
                  <CheckCircle size={20} className="text-white" />
                ) : (
                  i + 1
                )}
              </div>
              
              {/* Glow effect for current step */}
              {i === currentStep && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-[#1E3A5F] opacity-20 blur-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
            
            {/* Step label */}
            <div className="mt-4 text-center max-w-[120px]">
              <p 
                className={`text-xs font-medium transition-colors duration-300 ${
                  i <= currentStep ? 'text-[#212529]' : 'text-[#6C757D]'
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
          className="text-lg text-[#212529] font-semibold"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          {labels[currentStep]}
        </p>
        <p 
          className="text-sm text-[#6C757D] mt-1"
          style={{ fontFamily: 'DM Sans, sans-serif' }}
        >
          {currentStep + 1} sur {totalSteps} étapes
        </p>
      </motion.div>
    </div>
  </div>
);

export default StepIndicator;
