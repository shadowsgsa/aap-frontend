import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// import SelectContent from './SelectContent';
import MenuContent from './MenuContent';
import CardAlert from './CardAlert';
import OptionsMenu from './OptionsMenu';
import axios from 'axios';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
   const use1 = localStorage.getItem('user');
    const user = use1 ? JSON.parse(use1) : null;
      // console.log("User Info:", user.name);
  
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        {/* <SelectContent /> */}
              <Stack direction="row" justifyContent={'center'} alignItems="center" spacing={2} sx={{ width: "100%" }}>
  <Box 
    component="img"
    src="/logo.png"
    alt="Logo"
    sx={{ width: 70, height: 70, ml: 2 }} 
  />
  

</Stack>


      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
        <CardAlert />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
 <Avatar 
      sx={{ 
        width: 40, 
        height: 40, 
        bgcolor: '#B0BEC5', // light gray background
        fontSize: 18, 
        fontWeight: 'semi-bold' 
      }}
    >
      {user ? (user.name ? user.name.charAt(0).toUpperCase() : "G") : "G"}
    </Avatar>
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {user ? (user.name.length > 20 ? user.name.slice(0, 20) + "..." : user.name) : "Guest User"}

          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {user ? (user.email.length > 20 ? user.email.slice(0, 18) + "..." : user.email) : "Guest User"}
          </Typography>
        </Box>
        <OptionsMenu />
      </Stack>
    </Drawer>
  );
}
