import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { useKeycloak } from '@react-keycloak/web'
import SignIn from '../pages/login/SignIn'
import Dashboard from '../components/Dashboard'
import Home from '../pages/home/Home'
import HistoriaClinica from '../views/HistoriaClinica'
import Rol from '../views/Rol'
import FormatoHistoriaClinica from '../views/FormatoHistoriaClinica'
import FormatoInformacionPersonal from '../views/FormatoInformacionPersonal'
import FormatoPaciente from '../views/FormatoPaciente'
import Paciente from '../views/Paciente'
import InformacionPersonal from '../views/InformacionPersonal'
import Usuario from '../views/Usuario'
import VerHistoriaClinica from '../views/VerHistoriaClinica'

export default function Routes() {

    const { keycloak } = useKeycloak()

    const router = createBrowserRouter(
        keycloak.authenticated ?
            [
                {
                    path: "/",
                    element: <Dashboard />,
                    children: [
                        {
                            path: "*",
                            element: <Navigate to="/" />
                        },
                        {
                            path: "/",
                            element: <Home />
                        },
                        {
                            path: "/clinicalhistoryformat",
                            element: <FormatoHistoriaClinica />
                        },
                        {
                            path: "/clinicalhistory",
                            element: <HistoriaClinica />
                        },
                        {
                            path: "/patientformat",
                            element: <FormatoPaciente />
                        },
                        {
                            path: "/patient",
                            element: <Paciente />
                        },
                        {
                            path: "/role",
                            element: <Rol />
                        },
                        {
                            path: "/ver-historia-clinica",
                            element: <VerHistoriaClinica />
                        }
                    ]
                }
            ]
            :
            [
                {
                    path: "*",
                    element: <Navigate to="/login" />
                },
                {
                    path: "/login",
                    element: <SignIn />
                }
            ]
    )

    return (
        <RouterProvider router={router} />
    )
}