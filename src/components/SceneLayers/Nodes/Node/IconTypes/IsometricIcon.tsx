import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { PROJECTED_TILE_SIZE } from 'src/config';
import { useResizeObserver } from 'src/hooks/useResizeObserver';

interface Props {
  url: string;
  onImageLoaded?: () => void;
}

export const IsometricIcon = ({ url, onImageLoaded }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const { size } = useResizeObserver(ref.current);

  return (
    <Box
      ref={ref}
      component="img"
      onLoad={onImageLoaded}
      src={url}
      sx={{
        position: 'absolute',
        width: PROJECTED_TILE_SIZE.width * 0.8,
        top: -size.height,
        left: -size.width / 2,
        pointerEvents: 'none'
      }}
    />
  );
};
