import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { WalletMultiButton } from './wallet-impl/material-ui';
import { useTheme } from '@mui/material/styles';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from './Theme';
import SafecoinIcon from './resource/SafecoinIcon';
import ClusterSelect from './wallet-impl/react-ui/ClusterSelect';

export default function AppHeaderBar() {
  const ModeToggle = () => {
    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);
    console.log(`ModeToggle ${colorMode}`);

    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'inherit',
          color: 'text.primary',
          borderRadius: 1,
        }}>
        <Typography variant="caption" component="div">
          {theme.palette.mode}
        </Typography>
        <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
          {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Box>
    );
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary" enableColorOnDark>
        <Toolbar variant="dense">
          <IconButton
            size="large"
            edge="start"
            aria-label="menu"
          >
            <ModeToggle />
          </IconButton>

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fancy Safecoin App
          </Typography>
          <ClusterSelect />

          <WalletMultiButton />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
