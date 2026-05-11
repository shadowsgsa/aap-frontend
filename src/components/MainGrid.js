import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import axios from 'axios';

export default function MainGrid() {
  const [cardsData, setCardsData] = React.useState([]);

  React.useEffect(() => {
    const fetchAssessmentData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/assessment/');
        const assessments = response.data || [];
        console.log('Assessments:', assessments);

        const totalAssessments = assessments.length;
        const districts = new Set(assessments.map(a => a.district).filter(Boolean));
        const totalDistricts = districts.size;

        // Total children assessed dynamically
        const totalChildren = assessments.reduce((sum, a) => {
          const { data } = a;
          if (!data) return sum;

          const ageGroups = Object.values(data); // age_06_to_23_months, age_24_to_59_months
          return (
            sum +
            ageGroups.reduce((ageSum, ageGroup) => {
              const maleTotal = ageGroup.male?.totalChildrenAssessed || 0;
              const femaleTotal = ageGroup.female?.totalChildrenAssessed || 0;
              return ageSum + maleTotal + femaleTotal;
            }, 0)
          );
        }, 0);

        // Sparkline data
        const sparkChildrenData = assessments.map(a => {
          const { data } = a;
          if (!data) return 0;
          return Object.values(data).reduce((ageSum, ageGroup) => {
            const maleTotal = ageGroup.male?.totalChildrenAssessed || 0;
            const femaleTotal = ageGroup.female?.totalChildrenAssessed || 0;
            return ageSum + maleTotal + femaleTotal;
          }, 0);
        });

        setCardsData([
          {
            title: 'Total Assessments',
            value: totalAssessments,
            interval: 'All Time',
            trend: 'neutral',
            data: sparkChildrenData,
          },
          {
            title: 'Total Districts',
            value: totalDistricts,
            interval: 'All Time',
            trend: 'neutral',
            data: Array.from(districts).map((_, i) => i + 1),
          },
          {
            title: 'Children Assessed',
            value: totalChildren,
            interval: 'All Time',
            trend: 'neutral',
            data: sparkChildrenData,
          },
        ]);
      } catch (error) {
        console.error('Error fetching assessment data:', error);
      }
    };

    fetchAssessmentData();
  }, []);

return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Overview
      </Typography>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {cardsData.map((card, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <HighlightedCard />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SessionsChart />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PageViewsBarChart />
        </Grid>
      </Grid>
    
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
