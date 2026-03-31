import { useState } from "react";

interface CritereNoteProps {
  label: string;
  max: number;
  description: string;
  value?: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
}

const CritereNote = ({ 
  label, 
  max, 
  description, 
  value = 0, 
  onChange,
  disabled = false 
}: CritereNoteProps) => {
  const [localValue, setLocalValue] = useState(value || 0);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Math.min(max, Math.max(0, Number(e.target.value) || 0));
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getPercentage = () => {
    return (localValue / max) * 100;
  };

  const getColorClass = () => {
    const percentage = getPercentage();
    if (percentage === 0) return 'bg-gray-200';
    if (percentage < 33) return 'bg-red-500';
    if (percentage < 66) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className={`space-y-3 ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center justify-between">
        <label className="font-semibold text-[#212529]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
          {label}
        </label>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#24366E]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            {localValue}/{max}
          </span>
          <span className="text-sm text-[#6C757D]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            ({Math.round(getPercentage())}%)
          </span>
        </div>
      </div>
      
      <p className="text-sm text-[#6C757D] leading-relaxed" style={{ fontFamily: 'DM Sans, sans-serif' }}>
        {description}
      </p>

      <div className="space-y-2">
        {/* Slider visuel */}
        <div className="relative">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${getColorClass()}`}
              style={{ width: `${getPercentage()}%` }}
            ></div>
          </div>
          <input
            type="range"
            min={0}
            max={max}
            value={localValue}
            onChange={handleSliderChange}
            disabled={disabled}
            className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer disabled:cursor-not-allowed"
            style={{ 
              background: 'transparent',
              outline: 'none'
            }}
          />
        </div>

        {/* Input numérique */}
        <div className="flex items-center gap-3">
          <input
            type="number"
            min={0}
            max={max}
            value={localValue}
            onChange={handleInputChange}
            disabled={disabled}
            className="flex-1 px-3 py-2 rounded-lg border border-[#E9ECEF] bg-white text-[#212529] focus:outline-none focus:ring-2 focus:ring-[#40B2A4]/20 focus:border-[#40B2A4]/50 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ fontFamily: 'DM Sans, sans-serif' }}
          />
          
          {/* Boutons rapides */}
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => {
                const newValue = Math.max(0, localValue - 1);
                setLocalValue(newValue);
                onChange(newValue);
              }}
              disabled={disabled || localValue <= 0}
              className="w-8 h-8 rounded border border-[#E9ECEF] bg-white hover:bg-[#F8F9FA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                -
              </button>
            <button
              type="button"
              onClick={() => {
                const newValue = Math.min(max, localValue + 1);
                setLocalValue(newValue);
                onChange(newValue);
              }}
              disabled={disabled || localValue >= max}
              className="w-8 h-8 rounded border border-[#E9ECEF] bg-white hover:bg-[#F8F9FA] disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                +
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CritereNote;
