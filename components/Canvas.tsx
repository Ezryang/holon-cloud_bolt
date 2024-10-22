'use client';

import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FlowChart from '@/components/FlowChart';
import RobotCode from '@/components/RobotCode';

interface CanvasProps {
  activeView: 'FlowChart' | 'RobotCode';
  setActiveView: (view: 'FlowChart' | 'RobotCode') => void;
  flowChartSteps: string;
  robotCode: string;
  onAskAI: (text: string) => void;
}

export default function Canvas({ activeView, setActiveView, flowChartSteps, robotCode, onAskAI }: CanvasProps) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <Tabs value={activeView} onValueChange={(value) => setActiveView(value as 'FlowChart' | 'RobotCode')}>
          <TabsList>
            <TabsTrigger value="FlowChart">FlowChart</TabsTrigger>
            <TabsTrigger value="RobotCode">RobotCode</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button>部署到 HolonOS</Button>
      </div>
      <div className="flex-grow">
        <Tabs value={activeView} className="h-full">
          <TabsContent value="FlowChart" className="h-full">
            <FlowChart stepsString={flowChartSteps} />
          </TabsContent>
          <TabsContent value="RobotCode" className="h-full">
            <RobotCode code={robotCode} onAskAI={onAskAI} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}