import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { Gradient } from 'src/components/Gradient/Gradient';
import { ExpandButton } from './ExpandButton';
import { Label, Props as LabelProps } from './Label';

type Props = Omit<LabelProps, 'maxHeight'> & {
  onToggleExpand?: (isExpanded: boolean) => void;
};

export const ExpandableLabel = ({
  children,
  onToggleExpand,
  labelHeight = 80,
  ...rest
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentRendered, setContentRendered] = useState(false);

  const containerMaxHeight = useMemo(() => {
    return isExpanded ? undefined : labelHeight;
  }, [isExpanded, labelHeight]);

  useEffect(() => {
    // Ensure content is rendered before checking scrollHeight
    const timer = setTimeout(() => {
      setContentRendered(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const isContentTruncated = useMemo(() => {
    // Only show expansion icon if content actually overflows the container
    // Add a small buffer to account for padding/margins
    const actualContentHeight = contentRef.current?.scrollHeight || 0;
    return !isExpanded && contentRendered && actualContentHeight > labelHeight + 5;
  }, [isExpanded, contentRendered, labelHeight]);

  // Only show expansion button if content is actually truncated
  // or if we're currently expanded (to allow collapsing)
  const shouldShowExpandButton = useMemo(() => {
    return isContentTruncated || isExpanded;
  }, [isContentTruncated, isExpanded]);

  useEffect(() => {
    contentRef.current?.scrollTo({ top: 0 });
  }, [isExpanded]);

  return (
    <Label
      {...rest}
      labelHeight={labelHeight}
      maxHeight={containerMaxHeight}
      maxWidth={isExpanded ? rest.maxWidth * 1.5 : rest.maxWidth}
    >
      <Box
        ref={contentRef}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }}
        style={{
          overflowY: isExpanded ? 'scroll' : 'hidden',
          maxHeight: containerMaxHeight
        }}
      >
        {children}

        {isContentTruncated && (
          <Gradient
            sx={{
              position: 'absolute',
              width: '100%',
              height: 50,
              bottom: 0,
              left: 0
            }}
          />
        )}
      </Box>

      {shouldShowExpandButton && (
        <ExpandButton
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            m: 0.5
          }}
          isExpanded={isExpanded}
          onClick={() => {
            setIsExpanded(!isExpanded);
            onToggleExpand?.(!isExpanded);
          }}
        />
      )}
    </Label>
  );
};
