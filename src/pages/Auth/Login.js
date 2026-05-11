import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
// import AppNavbar from '../../components/AppNavbar';
import Header from '../../components/Header';
import Login from '../../components/Auth/login';
// import SideMenu from '../../components/SideMenu';
import AppTheme from '../../shared-theme/AppTheme';
// import Logo from '';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../../theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};
export default function LoginPage(props)  {
    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <Box
        position="absolute"
        top={16}
        left={16}
        component="img"
        src={'/logo.png'}
        alt="Logo"
        sx={{ height: 70, width: '70' }}
      />
        {/* <SideMenu /> */}
        {/* <AppNavbar /> */}
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            {/* <Header /> */}
            <Login />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
    );
}