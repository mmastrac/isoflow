import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Box } from '@mui/material';
import { Gradient } from 'src/components/Gradient/Gradient';
import { ExpandButton } from './ExpandButton';
import { Label, Props as LabelProps } from './Label';

type Props = Omit<LabelProps, 'maxHeight'> & {
  onToggleExpand?: (isExpanded: boolean) => void;
};

const STANDARD_LABEL_HEIGHT = 80;

export const ExpandableLabel = ({
  children,
  onToggleExpand,
  ...rest
}: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const containerMaxHeight = useMemo(() => {
    return isExpanded ? undefined : STANDARD_LABEL_HEIGHT;
  }, [isExpanded]);

  const isContentTruncated = useMemo(() => {
    // Only show expansion icon if content actually overflows the container
    // Use scrollHeight to measure the actual content height
    const actualContentHeight = contentRef.current?.scrollHeight || 0;
    const truncated =
      !isExpanded && actualContentHeight > STANDARD_LABEL_HEIGHT + 5;
    return truncated;
  }, [isExpanded]);

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
