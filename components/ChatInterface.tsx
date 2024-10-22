'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MenuIcon } from 'lucide-react';

interface ChatInterfaceProps {
  updateFlowChart: (steps: string) => void;
  updateRobotCode: (code: string) => void;
  referenceText: string;
}

export default function ChatInterface({ updateFlowChart, updateRobotCode, referenceText }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (referenceText) {
      setInput(prevInput => `${prevInput}\n\nReference: ${referenceText}`.trim());
    }
  }, [referenceText]);

  const handleSendMessage = async () => {
    if (input.trim()) {
      setMessages([...messages, { role: 'user', content: input }]);
      setInput('');
      const payload = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({message: input}),
      };
    
      try{ 
        const response = await fetch('https://dd57-114-137-199-220.ngrok-free.app/holonAI/CodeGen/', payload);
        if(!response.ok){
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const formattedMessage = data.message.replace(/\\n/g, '\n');
        
        // 解析步骤和代码
        const stepsMatch = formattedMessage.match(/Step 1:[\s\S]*?(?=```)/) || [''];
        const codeMatch = formattedMessage.match(/\/MN[\s\S]*?\/END/) || [''];
        
        const steps = stepsMatch[0].trim();
        const code = codeMatch[0].trim();
        
        // 更新消息
        setMessages((prevMessages) => [...prevMessages, { role: 'ai', content: formattedMessage }]);
        
        // 更新 FlowChart 和 RobotCode
        updateFlowChart(steps);
        updateRobotCode(code);
      }
      catch(error){
        console.error('Error:', error);
        setMessages((prevMessages) => [...prevMessages, { role: 'ai', content: '抱歉,处理您的请求时发生错误。' }]);
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-4 w-4" />
        </Button>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="model-h1">Model H1</SelectItem>
            <SelectItem value="model-h2">Model H2</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ScrollArea className="flex-grow p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
            <div className={`inline-block p-2 rounded-lg ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
              <pre className="whitespace-pre-wrap break-words">{message.content}</pre>
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  );
}