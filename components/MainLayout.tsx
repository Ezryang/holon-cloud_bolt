'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTheme } from 'next-themes';
import ChatInterface from './ChatInterface';
import Canvas from './Canvas';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';

export default function MainLayout() {
  const [activeView, setActiveView] = useState<'FlowChart' | 'RobotCode'>('FlowChart');
  const [flowChartSteps, setFlowChartSteps] = useState<string>('');
  const [robotCode, setRobotCode] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAskAI = useCallback((text: string) => {
    setSelectedText(text);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-background border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">HolonCloud</h1>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
        </Button>
      </header>
      <main className="flex-grow flex overflow-hidden">
        <div className="w-1/3 border-r overflow-y-auto">
          <ChatInterface
            updateFlowChart={setFlowChartSteps}
            updateRobotCode={setRobotCode}
            referenceText={selectedText}
          />
        </div>
        <div className="w-2/3 overflow-hidden">
          <Canvas
            activeView={activeView}
            setActiveView={setActiveView}
            flowChartSteps={flowChartSteps}
            robotCode={robotCode}
            onAskAI={handleAskAI}
          />
        </div>
      </main>
    </div>
  );
}