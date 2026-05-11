import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { LineChart } from '@mui/x-charts/LineChart';
import axios from 'axios';

function AreaGradient({ color, id }) {
  return (
    <defs>
      <linearGradient id={id} x1="50%" y1="0%" x2="50%" y2="100%">
        <stop offset="0%" stopColor={color} stopOpacity={0.5} />
        <stop offset="100%" stopColor={color} stopOpacity={0} />
      </linearGradient>
    </defs>
  );
}

AreaGradient.propTypes = {
  color: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
};

export default function ChildrenCuredChart() {
  const theme = useTheme();
  const [chartData, setChartData] = React.useState([]);
  const [totalCured, setTotalCured] = React.useState(0);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/assessment/');
        const assessments = response.data;

        // Prepare data for chart (assuming 30 days, using monthName and reportDate)
        const hospitalsData = [];
        const clinicsData = [];
        const homeVisitsData = [];

        let total = 0;

        assessments.forEach((item) => {
          // Sum male + female for age 06-23 and 24-59 months
          const male06_23 = item.data.age_06_to_23_months.male;
          const female06_23 = item.data.age_06_to_23_months.female;
          const male24_59 = item.data.age_24_to_59_months.male;
          const female24_59 = item.data.age_24_to_59_months.female;

          // Calculate total cured per day/source
          const hospitals = male06_23.samWithoutComplication + female06_23.samWithoutComplication +
                            male24_59.samWithoutComplication + female24_59.samWithoutComplication;

          const clinics = male06_23.mam + female06_23.mam + male24_59.mam + female24_59.mam;

          const homeVisits = male06_23.normal + female06_23.normal + male24_59.normal + female24_59.normal;

          hospitalsData.push(hospitals);
          clinicsData.push(clinics);
          homeVisitsData.push(homeVisits);

          total += hospitals + clinics + homeVisits;
        });

        setChartData({ hospitalsData, clinicsData, homeVisitsData });
        setTotalCured(total);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      }
    };

    fetchData();
  }, []);

  // Generate x-axis labels using report dates (if chartData exists)
  const xLabels = chartData.hospitalsData
    ? chartData.hospitalsData.map((_, i) => `Day ${i + 1}`)
    : [];

  return (
    <Card variant="outlined" sx={{ width: '100%' }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          Children Cured
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
              {totalCured}
            </Typography>
            <Chip size="small" color="success" label="+12%" />
          </Stack>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            Children cured per day for the last 30 days
          </Typography>
        </Stack>
        <LineChart
          colors={[
            theme.palette.primary.light,
            theme.palette.primary.main,
            theme.palette.primary.dark,
          ]}
          xAxis={[
            {
              scaleType: 'point',
              data: xLabels,
              tickInterval: (index, i) => (i + 1) % 5 === 0,
              height: 24,
            },
          ]}
          yAxis={[{ width: 50 }]}
          series={[
            {
              id: 'hospitals',
              label: 'Hospitals',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: chartData.hospitalsData || [],
            },
            {
              id: 'clinics',
              label: 'Clinics',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              area: true,
              stackOrder: 'ascending',
              data: chartData.clinicsData || [],
            },
            {
              id: 'homeVisits',
              label: 'Home Visits',
              showMark: false,
              curve: 'linear',
              stack: 'total',
              stackOrder: 'ascending',
              area: true,
              data: chartData.homeVisitsData || [],
            },
          ]}
          height={250}
          margin={{ left: 0, right: 20, top: 20, bottom: 0 }}
          grid={{ horizontal: true }}
          sx={{
            '& .MuiAreaElement-series-hospitals': { fill: "url('#hospitals')" },
            '& .MuiAreaElement-series-clinics': { fill: "url('#clinics')" },
            '& .MuiAreaElement-series-homeVisits': { fill: "url('#homeVisits')" },
          }}
          hideLegend
        >
          <AreaGradient color={theme.palette.primary.light} id="hospitals" />
          <AreaGradient color={theme.palette.primary.main} id="clinics" />
          <AreaGradient color={theme.palette.primary.dark} id="homeVisits" />
        </LineChart>
      </CardContent>
    </Card>
  );
}
