import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Collapse from '@mui/material/Collapse';
import { useNavigate, useLocation } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import DescriptionRoundedIcon from '@mui/icons-material/DescriptionRounded';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

// Department-specific icons
import AgricultureIcon from "@mui/icons-material/Agriculture";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import SchoolIcon from "@mui/icons-material/School";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import PetsIcon from "@mui/icons-material/Pets";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import GroupIcon from "@mui/icons-material/Group";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import BuildIcon from "@mui/icons-material/Build";
import AssessmentIcon from "@mui/icons-material/Assessment";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import CampaignIcon from "@mui/icons-material/Campaign";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

const departmentIcons = {
  "Agriculture": <AgricultureIcon sx={{ paddingRight: 1 }} />,
  "Supply & Prices": <AttachMoneyIcon sx={{ paddingRight: 1 }} />,
  "Education & Literacy": <SchoolIcon sx={{ paddingRight: 1 }} />,
  "Health": <HealthAndSafetyIcon sx={{ paddingRight: 1 }} />,
  "Livestock & Fisheries": <PetsIcon sx={{ paddingRight: 1 }} />,
  "Local Government": <AccountBalanceIcon sx={{ paddingRight: 1 }} />,
  "Population Welfare": <GroupIcon sx={{ paddingRight: 1 }} />,
  "Social Welfare": <VolunteerActivismIcon sx={{ paddingRight: 1 }} />,
  "Public Health Engineering": <BuildIcon sx={{ paddingRight: 1 }} />,
  "Planning & Development (P&DD)": <AssessmentIcon sx={{ paddingRight: 1 }} />,
  "Nutrition (DoN)": <RestaurantIcon sx={{ paddingRight: 1 }} />,
  "WASH Program": <WaterDropIcon sx={{ paddingRight: 1 }} />,
  "Social & Behaviour Change Communication (SBCC)": <CampaignIcon sx={{ paddingRight: 1 }} />,
  "Overall Objective Sector (OVOB)": <TrackChangesIcon sx={{ paddingRight: 1 }} />
};

const departmentList = Object.keys(departmentIcons);

export default function MenuContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = localStorage.getItem("role");

  const [openDept, setOpenDept] = useState(false);
  const [openChild, setOpenChild] = useState({});

  const toggleDepartmentDropdown = () => {
    setOpenDept(!openDept);
  };

  const toggleChildDropdown = (deptName) => {
    setOpenChild((prev) => ({
      ...prev,
      [deptName]: !prev[deptName],
    }));
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>

        {/* HOME */}
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === "/"}
            onClick={() => navigate("/")}
          >
            <ListItemIcon sx={{ color: "#00843E" }}>
              <HomeRoundedIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>

        {/* DEPARTMENTS MAIN TOGGLE */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleDepartmentDropdown}>
            <ListItemIcon sx={{ color: "#00843E" }}>
              <AccountBalanceIcon />
            </ListItemIcon>
            <ListItemText primary="Departments" />
            {openDept ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
        </ListItem>

        {/* DEPARTMENTS LIST */}
        <Collapse in={openDept} timeout="auto" unmountOnExit>
          <List component="div" disablePadding sx={{ pl: 0 }}>

            {departmentList.map((dept) => (
              <React.Fragment key={dept}>
                
                {/* Department Row */}
                <ListItemButton onClick={() => toggleChildDropdown(dept)}>
                  <ListItemIcon sx={{ fontSize: 8 }}>
                    {departmentIcons[dept]}
                  </ListItemIcon>
                  <ListItemText primary={dept} />
                  {openChild[dept] ? <ExpandLess sx={{ fontSize: 16 }} /> : <ExpandMore sx={{ fontSize: 16 }} />}
                </ListItemButton>

                {/* Upload + Manage */}
                <Collapse in={openChild[dept]} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding sx={{ pl: 1 }}>

                    {user === "admin" && (
                      <ListItemButton
                        selected={location.pathname === `/upload-content/${dept}`}
                        onClick={() => navigate(`/upload-content/${dept}`)}
                      >
                        <ListItemIcon sx={{ color: "#00843E", fontSize: 8 }}>
                          <AnalyticsRoundedIcon sx={{ paddingRight: 1 }} />
                        </ListItemIcon>
                        <ListItemText primary="Upload Content" />
                      </ListItemButton>
                    )}

                    <ListItemButton
                      selected={location.pathname === `/manage-content/${dept}`}
                      onClick={() => navigate(`/manage-content/${dept}`)}
                    >
                      <ListItemIcon sx={{ color: "#00843E", fontSize: 8 }}>
                        <DescriptionRoundedIcon sx={{ paddingRight: 1 }} />
                      </ListItemIcon>
                      <ListItemText primary="Manage Content" />
                    </ListItemButton>

                  </List>
                </Collapse>

              </React.Fragment>
            ))}

          </List>
        </Collapse>

      </List>

      {/* SECONDARY LIST (UNCHANGED) */}
      <List dense>
        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === "/settings"}
            onClick={() => navigate("/settings")}
          >
            <ListItemIcon><SettingsRoundedIcon /></ListItemIcon>
            <ListItemText primary="Settings" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === "/about"}
            onClick={() => navigate("/about")}
          >
            <ListItemIcon><InfoRoundedIcon /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            selected={location.pathname === "/feedback"}
            onClick={() => navigate("/feedback")}
          >
            <ListItemIcon><HelpRoundedIcon /></ListItemIcon>
            <ListItemText primary="Feedback" />
          </ListItemButton>
        </ListItem>
      </List>
    </Stack>
  );
}
