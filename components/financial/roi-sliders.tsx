'use client';

import React from 'react';
import { Sliders, Activity, Clock, Zap } from 'lucide-react';

export interface RoiSliderValues {
  bursts: number;
  flowRate: number;
  hoursSaved: number;
}

export interface RoiSlidersProps {
  values: RoiSliderValues;
  onChange: (newValues: RoiSliderValues) => void;
  className?: string;
}

export function RoiSliders({ values, onChange, className = '' }: RoiSlidersProps) {
  const handleChange = (field: keyof RoiSliderValues, val: number) => {
    onChange({
      ...values,
      [field]: val,
    });
  };

  return (
    <div
      className={`bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5 ${className}`}
      data-testid="roi-sliders"
    >
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Sliders size={16} className="text-amber-500" />
          <span>Operational Parameters</span>
        </div>
        <span className="text-[11px] text-slate-400">Interactive Sensitivity</span>
      </div>

      {/* Slider 1: Bursts per month */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label
            htmlFor="slider-bursts"
            className="flex items-center gap-1.5 text-slate-300 font-medium"
          >
            <Activity size={14} className="text-rose-400" />
            <span>Monthly Trunk Burst Events</span>
          </label>
          <span className="font-mono font-bold text-amber-400 text-sm">
            {values.bursts} <span className="text-xs text-slate-400 font-normal">events</span>
          </span>
        </div>
        <input
          id="slider-bursts"
          type="range"
          min="1"
          max="30"
          step="1"
          value={values.bursts}
          onChange={(e) => handleChange('bursts', Number(e.target.value))}
          className="w-full accent-amber-500 bg-slate-800 rounded-lg h-2 cursor-pointer"
          data-testid="slider-bursts"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>1 event</span>
          <span>15 events</span>
          <span>30 events/mo</span>
        </div>
      </div>

      {/* Slider 2: Average Flow Rate (kL/hour) */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label
            htmlFor="slider-flow"
            className="flex items-center gap-1.5 text-slate-300 font-medium"
          >
            <Zap size={14} className="text-cyan-400" />
            <span>Average Leakage Flow Rate</span>
          </label>
          <span className="font-mono font-bold text-cyan-400 text-sm">
            {values.flowRate} <span className="text-xs text-slate-400 font-normal">kL/hr</span>
          </span>
        </div>
        <input
          id="slider-flow"
          type="range"
          min="5"
          max="120"
          step="5"
          value={values.flowRate}
          onChange={(e) => handleChange('flowRate', Number(e.target.value))}
          className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
          data-testid="slider-flow-rate"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>5 kL/hr (minor)</span>
          <span>60 kL/hr</span>
          <span>120 kL/hr (catastrophic)</span>
        </div>
      </div>

      {/* Slider 3: Detection & Isolation Hours Saved */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <label
            htmlFor="slider-hours"
            className="flex items-center gap-1.5 text-slate-300 font-medium"
          >
            <Clock size={14} className="text-emerald-400" />
            <span>Detection & Isolation Hours Saved</span>
          </label>
          <span className="font-mono font-bold text-emerald-400 text-sm">
            {values.hoursSaved} <span className="text-xs text-slate-400 font-normal">hrs</span>
          </span>
        </div>
        <input
          id="slider-hours"
          type="range"
          min="4"
          max="72"
          step="2"
          value={values.hoursSaved}
          onChange={(e) => handleChange('hoursSaved', Number(e.target.value))}
          className="w-full accent-emerald-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
          data-testid="slider-hours-saved"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>4 hrs</span>
          <span>36 hrs</span>
          <span>72 hrs (baseline manual response)</span>
        </div>
      </div>
    </div>
  );
}
