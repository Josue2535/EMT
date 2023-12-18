import Banner from "../../components/Banner"
import welcome from '../../assets/welcome.jpg'


const Home = () => {
    return (
        <>
            <Banner post={
                {
                    "image": welcome,
                    "title": "Bienvenido, personal del EMT",
                    "description": "En este sitio podrá realizar observaciones y procedimientos pertinentes a su área de trabajo.",
                }
            } />
        </>
    )
}

export default Home