import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { SERVICOS, EQUIPE, formatarPreco } from '../data/servicos.js';

function Servicos() {
    const [barbeiroId, setBarbeiroId] = useState(EQUIPE[0].id);
    const barbeiro = EQUIPE.find((b) => b.id === barbeiroId);

    return (
        <>
            <Navbar />

            <main>
                <section className="card_inicial compacto">
                    <span className="selo">Serviços e portfólio</span>
                    <h1>
                        Nosso <span>trabalho</span>
                    </h1>
                    <p>
                        Veja o que fazemos e confira o resultado de cada barbeiro.
                        Escolheu o seu? É só agendar.
                    </p>

                    <div className="hero-botoes">
                        <a href="/agendamento" className="botao">Agendar agora</a>
                    </div>
                </section>

                <section className="secao">
                    <div className="secao-titulo">
                        <h2>Serviços</h2>
                        <p>Escolha o seu e agende com o barbeiro de preferência.</p>
                    </div>

                    <div className="servicos-grid">
                        {SERVICOS.map((servico) => (
                            <article key={servico.id} className="painel card_servico">
                                <h3>{servico.nome}</h3>
                                <p>{servico.descricao}</p>

                                <div className="rodape-servico">
                                    <span className="preco">{formatarPreco(servico.preco)}</span>
                                    <span className="duracao">{servico.duracao} min</span>
                                </div>

                                <a href={`/agendamento?servico=${servico.id}`} className="botao">
                                    Agendar
                                </a>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="secao">
                    <div className="secao-titulo">
                        <h2>Portfólio</h2>
                        <p>Escolha o barbeiro para ver os trabalhos dele.</p>
                    </div>

                    <div className="barbeiros">
                        {EQUIPE.map((b) => (
                            <button
                                key={b.id}
                                type="button"
                                className={`barbeiro-opcao ${b.id === barbeiroId ? 'sel' : ''}`}
                                aria-pressed={b.id === barbeiroId}
                                onClick={() => setBarbeiroId(b.id)}
                            >
                                <span className="barbeiro-inicial">{b.nome.charAt(0)}</span>
                                <span>
                                    <strong>{b.nome}</strong>
                                    <small>{b.especialidade}</small>
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="barbeiro-chamada">
                        <p>
                            Trabalhos de <strong>{barbeiro.nome}</strong>
                        </p>
                        <a
                            href={`/agendamento?barbeiro=${barbeiro.id}`}
                            className="botao"
                        >
                            Agendar com {barbeiro.nome}
                        </a>
                    </div>

                    {barbeiro.fotos.length > 0 ? (
                        <div className="galeria" key={barbeiro.id}>
                            {barbeiro.fotos.map((foto) => (
                                <figure key={foto.legenda} className="foto">
                                    {foto.src ? (
                                        <img src={foto.src} alt={`${foto.legenda} - ${barbeiro.nome}`} loading="lazy" />
                                    ) : (
                                        <div className="foto-vazia">Sua foto aqui</div>
                                    )}
                                    <figcaption>{foto.legenda}</figcaption>
                                </figure>
                            ))}
                        </div>
                    ) : (
                        <p className="dica">Este barbeiro ainda não tem fotos no portfólio.</p>
                    )}
                </section>

                <section className="painel cta-final">
                    <h2>Gostou do que viu?</h2>
                    <p>Garanta o seu horário e saia daqui com a autoestima lá em cima.</p>
                    <a href="/agendamento" className="botao">Agendar agora</a>
                </section>
            </main>

            <Footer />
        </>
    );
}

export default Servicos;