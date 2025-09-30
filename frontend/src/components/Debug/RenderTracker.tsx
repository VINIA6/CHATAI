import React, { useEffect, useRef } from 'react';

interface RenderTrackerProps {
  componentName: string;
  props?: Record<string, any>;
}

export const RenderTracker: React.FC<RenderTrackerProps> = ({ 
  componentName, 
  props = {} 
}) => {
  const renderCount = useRef(0);
  const prevProps = useRef(props);
  
  useEffect(() => {
    renderCount.current += 1;
    
    // Log every render
    console.log(`🔄 ${componentName} rendered #${renderCount.current}`);
    
    // Check for prop changes
    const changedProps = Object.keys(props).filter(
      key => prevProps.current[key] !== props[key]
    );
    
    if (changedProps.length > 0) {
      console.log(`📊 ${componentName} prop changes:`, changedProps.map(key => ({
        key,
        old: prevProps.current[key],
        new: props[key]
      })));
    }
    
    prevProps.current = props;
    
    // Warn about excessive renders
    if (renderCount.current > 10) {
      console.warn(`⚠️ ${componentName} has rendered ${renderCount.current} times! Possible infinite loop.`);
    }
  });
  
  return null;
};
