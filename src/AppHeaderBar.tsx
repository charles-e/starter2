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
import ClusterSelect from './wallet-impl/react-ui/ClusterSelect';
import { DrawerCtx } from './drawer/DrawerCtx';
import { useContext } from 'react';
import C2AOutlineIcon from '@mui/icons-material/PaidOutlined';
import C2AIcon from '@mui/icons-material/Paid';
import { useWallet } from './wallet-impl/wallet-adapter-react/useWallet';
import { Tooltip } from '@mui/material';

export default function AppHeaderBar() {


  const DrawerToggle = () => {
    const { visible, setVisible } = useContext(DrawerCtx);
    const { connected } = useWallet();
    function toggle() {
      setVisible(!visible);
    }
    if (connected) {
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
          <Tooltip title="Show Available Tokens">
            <IconButton sx={{ ml: 1 }} onClick={toggle} color="inherit">
              {visible === true ? <C2AOutlineIcon /> : <C2AIcon />}
            </IconButton>
          </Tooltip>
        </Box>);
    } else {
      return (<></>)
    }
  }


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
      <AppBar position="static" sx={{ zIndex : 100}} color="primary" enableColorOnDark>
        <Toolbar variant="dense">

          <ModeToggle />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Safecoin App
          </Typography>
          <ClusterSelect />

          <WalletMultiButton />

          <DrawerToggle />
        </Toolbar>
      </AppBar>
    </Box>
  );
}
