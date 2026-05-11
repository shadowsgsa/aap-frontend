import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { useLocation, Link as RouterLink } from 'react-router-dom';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// Map routes to display names
const routeNameMap = {
  '/': 'Dashboard',
  '/upload-content': 'Upload Content',
  '/settings': 'Settings',
  '/about': 'About',
  '/feedback': 'Feedback',
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean); // ["upload-content"]

  // Build breadcrumb items
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return (
      <Typography
        key={path}
        variant="body1"
        sx={{ color: 'text.primary', fontWeight: 600 }}
      >
        {routeNameMap[path] || segment}
      </Typography>
    );
  });

  // Include "Dashboard" as root
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <RouterLink to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Typography variant="body1">Dashboard</Typography>
      </RouterLink>
      {breadcrumbs}
    </StyledBreadcrumbs>
  );
}
