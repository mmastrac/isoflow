import React from 'react';
import { Grid, Typography } from '@mui/material';
import { Section } from './Section';

interface Props {
  title: string;
}

export const Header = ({ title }: Props) => {
  return (
    <Section sx={{ py: 3 }}>
      <Grid container spacing={2}>
        <Grid size={10}>
          <Typography variant="h6" fontWeight={600}>
            {title}
          </Typography>
        </Grid>
      </Grid>
    </Section>
  );
};
