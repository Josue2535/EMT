import * as React from 'react'
import { styled, createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import Menu from './Menu'
import { Outlet } from 'react-router-dom'
import { Grid, Paper, useMediaQuery } from '@mui/material'
import Copyright from './Copyright'
import { Logout } from '@mui/icons-material'
import logo from '../assets/logo.png'
import { useKeycloak } from '@react-keycloak/web'

const drawerWidth = 340

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        '& .MuiDrawer-paper': {
            position: 'relative',
            whiteSpace: 'nowrap',
            width: drawerWidth,
            transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
            boxSizing: 'border-box',
            ...(!open && {
                overflowX: 'hidden',
                transition: theme.transitions.create('width', {
                    easing: theme.transitions.easing.sharp,
                    duration: theme.transitions.duration.leavingScreen,
                }),
                width: theme.spacing(7),
                [theme.breakpoints.up('sm')]: {
                    width: theme.spacing(9),
                },
            }),
            '& .MuiList-root': {
                overflowX: 'hidden',
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 65px)',
            },
        },
    }),
)

const mdTheme = createTheme({
    palette: { primary: { main: '#00adef' }, secondary: { main: '#04b44c' } }
})

const Dashboard = () => {

    const { keycloak } = useKeycloak()

    const [open, setOpen] = React.useState(false)

    let mobile = false
    useMediaQuery('(min-width:1200px)') ? (mobile = false) : (mobile = true)

    const toggleDrawer = () => {
        setOpen(!open)
    }

    const handleLogout = () => {
        keycloak.logout()
    }

    return (
        <ThemeProvider theme={mdTheme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar position="absolute" open={open}>
                    <Toolbar
                        sx={{
                            pr: 1,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <IconButton
                            edge="start"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{
                                ...(open && { display: 'none' }), color: 'white'
                            }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            component="h1"
                            variant="h6"
                            align="center"
                            color="white"
                            noWrap
                            sx={{ flexGrow: 1 }}
                        >
                            {mobile && open ? '' : 'Emergency Medical Team'}
                        </Typography>
                        <IconButton  sx={{ color: 'white' }} onClick={handleLogout}>
                            <Logout />
                        </IconButton>
                    </Toolbar>
                </AppBar>
                {!mobile ?
                    <Drawer variant="permanent" open={open}>
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [1],
                            }}
                        >
                            <Grid container justifyContent="center">
                                <img src={logo} alt="Logo" width="50" />
                            </Grid>
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List component="nav">
                            <Menu />
                        </List>
                    </Drawer>
                    :
                    <MuiDrawer
                        variant="temporary"
                        open={open}
                        onClose={toggleDrawer}
                        ModalProps={{
                            keepMounted: true
                        }}
                        sx={{
                            display: { xs: 'block', sm: 'block', md: 'block', lg: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: drawerWidth,
                            }
                        }}
                    >
                        <Toolbar
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                px: [1],
                            }}
                        >
                            <Grid container justifyContent="center">
                                <img src={logo} alt="Logo" width="50" />
                            </Grid>
                            <IconButton onClick={toggleDrawer}>
                                <ChevronLeftIcon />
                            </IconButton>
                        </Toolbar>
                        <Divider />
                        <List component="nav">
                            <Menu mobile={mobile} toggleDrawer={toggleDrawer} />
                        </List>
                    </MuiDrawer>
                }
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) =>
                            theme.palette.mode === 'light'
                                ? theme.palette.grey[100]
                                : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '100vh',
                        overflow: 'auto',
                    }}
                >
                    <Toolbar />
                    <Container maxWidth="100%" sx={{ mt: 4, mb: 3 }}>
                        <Box component={Paper} xs={12} sx={{ p: 2 }} align="center">
                            <Outlet />
                        </Box>
                        <Copyright sx={{ mt: 3 }} />
                    </Container>
                </Box>
            </Box>
        </ThemeProvider>
    )
}

export default Dashboard