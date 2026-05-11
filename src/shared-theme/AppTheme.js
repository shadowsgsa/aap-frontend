import * as React from 'react';
import PropTypes from 'prop-types';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { inputsCustomizations } from './customizations/inputs';
import { dataDisplayCustomizations } from './customizations/dataDisplay';
import { feedbackCustomizations } from './customizations/feedback';
import { navigationCustomizations } from './customizations/navigation';
import { surfacesCustomizations } from './customizations/surfaces';

import { typography, shadows, shape } from './themePrimitives';

function AppTheme(props) {
  const { children, disableCustomTheme, themeComponents } = props;

  const theme = React.useMemo(() => {
    if (disableCustomTheme) return {};

    // FINAL: Only light theme
    return createTheme({
      palette: {
        mode: 'light',
        primary: { main: '#4caf50' },
        background: {
          default: '#f4f6f8',
          paper: '#ffffff',
        },
      },
      typography,
      shadows,
      shape,
      components: {
        ...inputsCustomizations,
        ...dataDisplayCustomizations,
        ...feedbackCustomizations,
        ...navigationCustomizations,
        ...surfacesCustomizations,
        ...themeComponents,
      },
    });
  }, [disableCustomTheme, themeComponents]);

  if (disableCustomTheme) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}

AppTheme.propTypes = {
  children: PropTypes.node,
  disableCustomTheme: PropTypes.bool,
  themeComponents: PropTypes.object,
};

export default AppTheme;
