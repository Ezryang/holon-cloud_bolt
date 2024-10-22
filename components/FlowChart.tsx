'use client';

import React, { useEffect, useState } from 'react';

interface Step {
  number: number;
  content: string;
}

interface FlowChartProps {
  stepsString: string;
}

const FlowChart: React.FC<FlowChartProps> = ({ stepsString }) => {
  const [steps, setSteps] = useState<Step[]>([]);

  useEffect(() => {
    if (stepsString) {
      const parsedSteps = stepsString.split('\n')
        .filter(step => step.trim().startsWith('Step'))
        .map((step, index) => {
          const [, content] = step.split(': ');
          return { number: index + 1, content: content.trim() };
        });
      setSteps(parsedSteps);
    }
  }, [stepsString]);

  return (
    <div className="flex flex-col items-center space-y-4 p-4 bg-black text-white">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="bg-gray-800 rounded-lg p-4 w-full max-w-md">
            <h2 className="text-gray-400 mb-2">Step{step.number}</h2>
            <p className="text-sm">{step.content}</p>
          </div>
          {index < steps.length - 1 && (
            <div className="w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[16px] border-t-gray-600"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default FlowChart;
