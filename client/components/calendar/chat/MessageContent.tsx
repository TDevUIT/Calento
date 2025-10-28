'use client';

import React from 'react';
import { CheckCircle, Calendar, Clock, Search } from 'lucide-react';

interface MessageContentProps {
  content: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  'âœ…': CheckCircle,
  'ðŸ“…': Calendar,
  'â°': Clock,
  'ðŸ”Ž': Search,
};

export const MessageContent = ({ content }: MessageContentProps) => {
  const renderContent = () => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let currentList: string[] = [];
    let listIndex = 0;
    let firstParagraphRendered = false;

    const flushList = () => {
      if (currentList.length > 0) {
        elements.push(
          <ul key={`list-${listIndex++}`} className="space-y-2 my-3">
            {currentList.map((item, idx) => {
              const richMatch = item.match(/^[\s]*[\*\-•]\s*(?:([📅✅⏰🔎🎯⚡])\s*)?(?:\*\*(.*?)\*\*)?(.*)$/);
              if (richMatch) {
                const [, emoji, boldMaybe, restRaw] = richMatch;
                const boldText = (boldMaybe || '').trim();
                const rest = (restRaw || '').trim();
                let Icon = emoji ? iconMap[emoji] : undefined;

                if (!Icon && boldText) {
                  const key = boldText.toLowerCase();
                  if (key.includes('schedule')) Icon = Calendar;
                  else if (key.includes('availability') || key.includes('check')) Icon = Search;
                  else if (key.includes('task')) Icon = CheckCircle;
                  else if (key.includes('time') || key.includes('duration')) Icon = Clock;
                }

                const exampleMatch = rest.match(/\"([^\"]+)\"/);
                const exampleText = exampleMatch ? exampleMatch[1] : '';

                return (
                  <li key={idx} className="flex items-start gap-2 group">
                    <div className="h-6 w-6 rounded-md bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                      {Icon ? <Icon className="h-3.5 w-3.5 text-blue-600" /> : <span className="text-blue-600">•</span>}
                    </div>
                    <div className="flex-1 pt-0.5">
                      {boldText ? (
                        <>
                          <span className="font-semibold text-gray-900">{boldText}</span>
                          {rest && <span className="text-gray-700">{` ${rest}`}</span>}
                          {exampleText && (
                            <div className="mt-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs">
                                <span className="opacity-70">â€œ</span>
                                <span className="font-medium">{exampleText}</span>
                                <span className="opacity-70">â€</span>
                              </span>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-700">{rest}</span>
                      )}
                    </div>
                  </li>
                );
              }

              const simpleMatch = item.match(/^[\s]*[\*\-•]\s*(.+)$/);
              if (simpleMatch) {
                const text = simpleMatch[1];
                const parts = text.split(/(\*\*.*?\*\*)/g);
                const exampleMatch = text.match(/\"([^\"]+)\"/);
                const exampleText = exampleMatch ? exampleMatch[1] : '';
                return (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">•</span>
                    <div className="text-gray-700 flex-1">
                      <span>
                        {parts.map((part, i) =>
                          part.startsWith('**') && part.endsWith('**') ? (
                            <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>
                          ) : (
                            <span key={i}>{part}</span>
                          )
                        )}
                      </span>
                      {exampleText && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs">
                            <span className="opacity-70">â€œ</span>
                            <span className="font-medium">{exampleText}</span>
                            <span className="opacity-70">â€</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              }

              return null;
            })}
          </ul>
        );
        currentList = [];
      }
    };

    lines.forEach((line, idx) => {
      if (line.trim().startsWith('*') || line.trim().startsWith('-') || line.trim().startsWith('•')) {
        currentList.push(line);
      } else {
        flushList();
        
        if (line.trim() === '') {
          return;
        }
        
        if (line.match(/^#{1,3}\s/)) {
          const level = line.match(/^(#{1,3})/)?.[1].length || 1;
          const text = line.replace(/^#{1,3}\s/, '');
          const className = level === 1 ? 'text-lg font-bold text-gray-900 mb-2' :
                          level === 2 ? 'text-base font-semibold text-gray-900 mb-2' :
                          'text-sm font-semibold text-gray-800 mb-1';
          elements.push(
            <h3 key={`heading-${idx}`} className={className}>
              {text}
            </h3>
          );
        } else if (line.includes('**')) {
          const parts = line.split(/(\*\*.*?\*\*)/g);
          elements.push(
            <p key={`text-${idx}`} className={`text-sm ${!firstParagraphRendered ? 'text-gray-900 font-medium' : 'text-gray-700'} mb-2`}>
              {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                }
                return <span key={i}>{part}</span>;
              })}
            </p>
          );
          firstParagraphRendered = true;
        } else {
          const hasEmoji = /[ðŸ“…âœ…â°ðŸ”ŽðŸŽ¯âš¡ðŸ’¡ðŸš€âœ¨]/g.test(line);
          const isQuestion = /\?\s*([ðŸ“…âœ…â°ðŸ”ŽðŸŽ¯âš¡ðŸ’¡ðŸš€âœ¨])?$/.test(line.trim());
          elements.push(
            <p key={`text-${idx}`} className={`text-sm ${!firstParagraphRendered ? 'text-gray-900 font-medium' : 'text-gray-700'} ${hasEmoji ? 'leading-relaxed' : ''} ${isQuestion ? 'mt-3' : ''} mb-2`}>
              {line}
            </p>
          );
          firstParagraphRendered = true;
        }
      }
    });

    flushList();
    
    return elements;
  };

  return <div className="space-y-1">{renderContent()}</div>;
};
