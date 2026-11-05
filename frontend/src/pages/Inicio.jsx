import Navbar from '../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer.jsx';

function Inicio() {
    return (
        <>
            <Navbar />

            <main>
                <section className="card_inicial">
                    <span className="selo">Desde 2006</span>
                    <h1>
                        Seja bem-vindo à <span>barbearia!</span>
                    </h1>
                    <p>
                        Aqui priorizamos sua experiência e autoestima.
                        Fazemos até milagres, porém não prometemos nada.
                    </p>

                    <div className="hero-botoes">
                        <Link to="/agendamento" className="botao">Agendar agora</Link>
                        <a href="/servicos" className="botao contorno">Ver serviços</a>
                    </div>
                </section>

                <section className="info">
                    <div className="info-item">
                        <div>
                            <strong>Horário</strong>
                            <span>Segunda a Sábado, 09h às 20h</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div>
                            <strong>Barbeiros</strong>
                            <span>Escolha o de sua preferência</span>
                        </div>
                    </div>

                    <div className="info-item">
                        <div>
                            <strong>Experiência</strong>
                            <span>Mais de 20 anos de tradição</span>
                        </div>
                    </div>
                </section>

                <div className="cards">
                    <section className="card_portifolio">
                        <h2>Conheça nosso trabalho!</h2>
                        <p>
                            Ainda possui desconfiança do nosso trabalho?
                            Confira nosso portfólio e tire suas próprias conclusões.
                        </p>
                        <a href="/servicos">Ver serviços</a>
                    </section>

                    <section className="card_agendamento">
                        <h2>Não fique de fora!</h2>
                        <p>
                            Agende um possível milagre agora, com seu barbeiro de preferência.
                        </p>
                        <a href="/agendamento">Agendar agora</a>
                    </section>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Inicio;
