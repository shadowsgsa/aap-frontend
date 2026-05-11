import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import LightbulbRoundedIcon from '@mui/icons-material/LightbulbRounded';

export default function CardAlert() {
  return (
    <Card variant="outlined" sx={{ m: 1.5, flexShrink: 0 }}>
      <CardContent>
        {/* <LightbulbRoundedIcon fontSize="small" sx={{ color: '#00843E' }} /> */}

        <Typography gutterBottom sx={{ fontWeight: 600, mt: 1 }}>
          Tip
        </Typography>

        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          Keep your content updated regularly.
        </Typography>

<Button
  // variant="contained"
  size="small"
  fullWidth
  sx={{
    backgroundColor: '#00843E',
    color: '#FFFFFF',
    '&:hover': {
      backgroundColor: '#006f34',
    },
  }}
>
  Learn More
</Button>

      </CardContent>
    </Card>
  );
}
