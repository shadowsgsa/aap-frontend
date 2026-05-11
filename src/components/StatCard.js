import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

function getDaysForData(length) {
  return Array.from({ length }, (_, i) => `Day ${i + 1}`);
}

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.3} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default function StatCard({ title, interval, value, trend, data }) {
  const theme = useTheme();

  const displayValue = typeof value === 'number' ? value : 0;
  const sparkData = Array.isArray(data) && data.length > 0 ? data : [0];

  const trendColors = {
    up: theme.palette.success.main,
    down: theme.palette.error.main,
    neutral: theme.palette.grey[400],
  };

  const labelColors = {
    up: 'success',
    down: 'error',
    neutral: 'default',
  };

  const chartColor = trendColors[trend] || trendColors.neutral;
  const chipColor = labelColors[trend] || labelColors.neutral;

  const trendLabels = {
    up: '+25%',
    down: '-25%',
    neutral: '0%',
  };

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack direction="column" spacing={1}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">{displayValue.toLocaleString()}</Typography>
            <Chip size="small" color={chipColor} label={trendLabels[trend] || '0%'} />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {interval}
          </Typography>
          <Box sx={{ width: '100%', height: 80 }}>
            <SparkLineChart
              color={chartColor}
              data={sparkData}
              area
              // showHighlight
              noDataOverlay={false}
              showTooltip
              xAxis={{ scaleType: 'band', data: getDaysForData(sparkData.length) }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#area-gradient-${title.replace(/\s/g, '')})`,
                },
              }}
            >
              <AreaGradient color={chartColor} id={`area-gradient-${title.replace(/\s/g, '')}`} />
            </SparkLineChart>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  interval: PropTypes.string.isRequired,
  value: PropTypes.number,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  data: PropTypes.arrayOf(PropTypes.number),
};
