import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { BarChart } from '@mui/x-charts/BarChart';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';

export default function ChildrenStatusBarChart() {
  const theme = useTheme();
  const [chartData, setChartData] = React.useState({
    months: [],
    samWithComplication: [],
    samWithoutComplication: [],
    mam: [],
    normal: [],
    total: 0,
    percentageChange: 0,
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/assessment/');
        const assessments = response.data;

        // Aggregate data by month
        const months = [];
        const samWithComplication = [];
        const samWithoutComplication = [];
        const mam = [];
        const normal = [];
        let total = 0;

        assessments.forEach((item) => {
          months.push(item.monthName);

          const male06_23 = item.data.age_06_to_23_months.male;
          const female06_23 = item.data.age_06_to_23_months.female;
          const male24_59 = item.data.age_24_to_59_months.male;
          const female24_59 = item.data.age_24_to_59_months.female;

          const samC = male06_23.samWithComplication + female06_23.samWithComplication +
                       male24_59.samWithComplication + female24_59.samWithComplication;

          const samNC = male06_23.samWithoutComplication + female06_23.samWithoutComplication +
                        male24_59.samWithoutComplication + female24_59.samWithoutComplication;

          const m = male06_23.mam + female06_23.mam + male24_59.mam + female24_59.mam;
          const n = male06_23.normal + female06_23.normal + male24_59.normal + female24_59.normal;

          samWithComplication.push(samC);
          samWithoutComplication.push(samNC);
          mam.push(m);
          normal.push(n);

          total += samC + samNC + m + n;
        });

        // Example percentage change vs previous period (simplified)
        const previousTotal = total - 50; // replace with real calculation if available
        const percentageChange = ((total - previousTotal) / previousTotal) * 100;

        setChartData({
          months,
          samWithComplication,
          samWithoutComplication,
          mam,
          normal,
          total,
          percentageChange: Math.round(percentageChange),
        });
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      }
    };

    fetchData();
  }, []);

  const colorPalette = [
    theme.palette.error.main,    // SAM with complication
    theme.palette.warning.main,  // SAM without complication
    theme.palette.info.main,     // MAM
    theme.palette.success.main,  // Normal
  ];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Children Status per Month
        </Typography>
        <Stack sx={{ justifyContent: 'space-between' }}>
          <Stack
            direction="row"
            sx={{
              alignContent: { xs: 'center', sm: 'flex-start' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography variant="h4" component="p">
              {chartData.total}
            </Typography>
            <Chip
              size="small"
              color={chartData.percentageChange >= 0 ? 'success' : 'error'}
              label={`${chartData.percentageChange >= 0 ? '+' : ''}${chartData.percentageChange}%`}
            />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Children assessed per month for the last {chartData.months.length} months
          </Typography>
        </Stack>
        <BarChart
          borderRadius={8}
          colors={colorPalette}
          xAxis={[
            {
              scaleType: 'band',
              categoryGapRatio: 0.5,
              data: chartData.months.length ? chartData.months : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            { id: 'samWithComplication', label: 'SAM with Complication', data: chartData.samWithComplication, stack: 'A' },
            { id: 'samWithoutComplication', label: 'SAM without Complication', data: chartData.samWithoutComplication, stack: 'A' },
            { id: 'mam', label: 'MAM', data: chartData.mam, stack: 'A' },
            { id: 'normal', label: 'Normal', data: chartData.normal, stack: 'A' },
          ]}
          height={250}
          margin={{ left: 0, right: 0, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          hideLegend
        />
      </CardContent>
    </Card>
  );
}
