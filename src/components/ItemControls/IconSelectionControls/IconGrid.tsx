import React from 'react';
import { Icon as IconI } from 'src/types';
import { Grid } from '@mui/material';
import { Icon } from './Icon';

interface Props {
  icons: IconI[];
  onMouseDown?: (icon: IconI) => void;
  onClick?: (icon: IconI) => void;
}

export const IconGrid = ({ icons, onMouseDown, onClick }: Props) => {
  return (
    <Grid container>
      {icons.map((icon) => {
        return (
          <Grid size={3} key={icon.id}>
            <Icon
              icon={icon}
              onClick={
                onClick
                  ? () => {
                      return onClick(icon);
                    }
                  : undefined
              }
              onMouseDown={
                onMouseDown
                  ? () => {
                      return onMouseDown(icon);
                    }
                  : undefined
              }
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
