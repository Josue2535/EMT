import * as React from 'react'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import createTheme from '@mui/material/styles/createTheme'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { useKeycloak } from '@react-keycloak/web'
import Copyright from '../../components/Copyright'
import signin from '../../assets/signin.jpg'
import logo from '../../assets/logo.png'

const theme = createTheme({
    palette: { primary: { main: '#00adef' }, secondary: { main: '#04b44c' } }
})

const SignIn = () => {

    const { keycloak } = useKeycloak()

    const handleSubmit = (event) => {
        event.preventDefault()
        keycloak.login()
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: `url(${signin})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item container xs={12} sm={8} md={5} justifyContent={"center"} alignItems="center" component={Paper}>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: "center"
                        }}
                    >
                        <img src={logo} alt="Logo" width="100" />
                        <Typography component="h3" color={"primary"} variant="h5" sx={{ mt: 3, textAlign: 'center' }}>
                            EMT
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 2, mb: 3 }}
                            >
                                <Typography color="white">
                                    Iniciar sesión
                                </Typography>
                            </Button>
                            <Copyright />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}

export default SignIn