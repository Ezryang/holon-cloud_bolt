'use client';

import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface RobotCodeProps {
  code: string;
  onAskAI: (text: string) => void;
}

export default function RobotCode({ code, onAskAI }: RobotCodeProps) {
  const [robotCode, setRobotCode] = useState('');
  const [selectedFile, setSelectedFile] = useState('main.ls');
  const [selectedText, setSelectedText] = useState('');
  const [showAskAIButton, setShowAskAIButton] = useState(false);
  const [askAIButtonPosition, setAskAIButtonPosition] = useState({ top: 0, left: 0 });
  const files = ['main.ls', 'gripper.ls', 'moveToTable.ls'];
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (code) {
      setRobotCode(code);
    }
  }, [code]);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    editor.onDidChangeCursorSelection((e: any) => {
      const selection = editor.getModel().getValueInRange(e.selection);
      if (selection) {
        setSelectedText(selection);
        const { top, left } = editor.getContainerDomNode().getBoundingClientRect();
        const { top: selectionTop, left: selectionLeft } = editor.getScrolledVisiblePosition(e.selection.getStartPosition());
        setAskAIButtonPosition({ top: top + selectionTop, left: left + selectionLeft });
        setShowAskAIButton(true);
      } else {
        setShowAskAIButton(false);
      }
    });
  };

  const handleAskAI = () => {
    if (selectedText) {
      onAskAI(selectedText);
      setShowAskAIButton(false);
    }
  };

  return (
    <div className="h-full flex">
      <div className="w-1/4 border-r">
        <ScrollArea className="h-full">
          {files.map((file) => (
            <div
              key={file}
              className={`p-2 cursor-pointer hover:bg-secondary ${file === selectedFile ? 'bg-secondary' : ''}`}
              onClick={() => setSelectedFile(file)}
            >
              {file}
            </div>
          ))}
        </ScrollArea>
      </div>
      <Separator orientation="vertical" />
      <div className="flex-grow relative">
        <MonacoEditor
          height="100%"
          defaultLanguage="plaintext"
          theme="vs-dark"
          value={robotCode}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            readOnly: false,
          }}
          onMount={handleEditorDidMount}
        />
        {showAskAIButton && (
          <Button
            className="absolute z-10 bg-blue-500 hover:bg-blue-600 text-white text-xs py-1 px-2"
            style={{
              top: `${askAIButtonPosition.top}px`,
              left: `${askAIButtonPosition.left}px`,
            }}
            onClick={handleAskAI}
          >
            Ask AI
          </Button>
        )}
      </div>
    </div>
  );
}