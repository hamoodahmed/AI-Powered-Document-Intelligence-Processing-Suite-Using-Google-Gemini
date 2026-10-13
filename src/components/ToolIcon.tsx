import React from 'react';
import {
  Combine,
  Scissors,
  Minimize2,
  ImageDown,
  ImageUp,
  Stamp,
  ShieldCheck,
  Sparkles,
  MessageSquareText,
  HelpCircle,
  ListFilter,
  FileText,
} from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Combine':
      return <Combine className={className} />;
    case 'Scissors':
      return <Scissors className={className} />;
    case 'Minimize2':
      return <Minimize2 className={className} />;
    case 'ImageDown':
      return <ImageDown className={className} />;
    case 'ImageUp':
      return <ImageUp className={className} />;
    case 'Stamp':
      return <Stamp className={className} />;
    case 'ShieldLock':
      return <ShieldCheck className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'MessageSquareText':
      return <MessageSquareText className={className} />;
    case 'HelpCircle':
      return <HelpCircle className={className} />;
    case 'ListFilter':
      return <ListFilter className={className} />;
    default:
      return <FileText className={className} />;
  }
};
