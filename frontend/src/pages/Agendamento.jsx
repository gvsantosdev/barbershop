import { useState, useMemo } from 'react';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import {
    SERVICOS,
    EQUIPE,
    BARBEIROS,
    WHATSAPP,
    ABERTURA,
    FECHAMENTO,
    formatarPreco,
} from '../data/servicos.js';

// Horários de 30 em 30 minutos dentro do expediente
const HORARIOS = [];
for (let minutos = ABERTURA; minutos < FECHAMENTO; minutos += 30) {
    const h = String(Math.floor(minutos / 60)).padStart(2, '0');
    const m = String(minutos % 60).padStart(2, '0');
    HORARIOS.push({ texto: `${h}:${m}`, minutos });
}

function hojeISO() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mes}-${dia}`;
}

function formatarData(iso) {
    return new Date(`${iso}T00:00:00`).toLocaleDateString('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long',
    });
}

function mascaraTelefone(valor) {
    const n = valor.replace(/\D/g, '').slice(0, 11);
    if (n.length <= 2) return n;
    if (n.length <= 7) return `(${n.slice(0, 2)}) ${n.slice(2)}`;
    return `(${n.slice(0, 2)}) ${n.slice(2, 7)}-${n.slice(7)}`;
}

function Agendamento() {
    // Se veio de um card de serviço (?servico=corte), já deixa selecionado
    const [servicoId, setServicoId] = useState(() => {
        const id = new URLSearchParams(window.location.search).get('servico');
        return SERVICOS.some((s) => s.id === id) ? id : '';
    });
    // Se veio do portfólio de um barbeiro (?barbeiro=barbeiro-1), já deixa selecionado
    const [barbeiro, setBarbeiro] = useState(() => {
        const id = new URLSearchParams(window.location.search).get('barbeiro');
        const escolhido = EQUIPE.find((b) => b.id === id);
        return escolhido ? escolhido.nome : BARBEIROS[0];
    });
    const [data, setData] = useState('');
    const [horario, setHorario] = useState('');
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [erro, setErro] = useState('');
    const [enviado, setEnviado] = useState(false);

    const servico = SERVICOS.find((s) => s.id === servicoId);
    const domingo = data !== '' && new Date(`${data}T00:00:00`).getDay() === 0;

    const horarios = useMemo(() => {
        if (!data || domingo) return [];

        const agora = new Date();
        const ehHoje = data === hojeISO();
        const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
        const duracao = servico ? servico.duracao : 30;

        return HORARIOS.map((h) => ({
            ...h,
            livre:
                h.minutos + duracao <= FECHAMENTO &&
                (!ehHoje || h.minutos > minutosAgora),
        }));
    }, [data, domingo, servico]);

    function aoMudarServico(e) {
        setServicoId(e.target.value);
        setHorario('');
    }

    function aoMudarData(e) {
        setData(e.target.value);
        setHorario('');
    }

    function enviar(e) {
        e.preventDefault();
        setErro('');

        if (!servico) return setErro('Escolha um serviço.');
        if (!data) return setErro('Escolha uma data.');
        if (data < hojeISO()) return setErro('Escolha uma data a partir de hoje.');
        if (domingo) return setErro('Não atendemos aos domingos. Escolha outro dia.');
        if (!horario) return setErro('Escolha um horário.');
        if (nome.trim().length < 2) return setErro('Informe seu nome.');
        if (telefone.replace(/\D/g, '').length < 10) {
            return setErro('Informe um telefone válido, com DDD.');
        }

        setEnviado(true);
    }

    // TELA DE CONFIRMAÇÃO
    if (enviado) {
        const mensagem = [
            'Olá! Gostaria de agendar um horário:',
            '',
            `Serviço: ${servico.nome}`,
            `Barbeiro: ${barbeiro}`,
            `Data: ${formatarData(data)}`,
            `Horário: ${horario}`,
            `Nome: ${nome.trim()}`,
            `Telefone: ${telefone}`,
        ].join('\n');

        const linkWhatsapp = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`;

        return (
            <>
                <Navbar />

                <main>
                    <section className="painel confirmacao">
                        <span className="selo-escuro">Revise e envie</span>
                        <h2>Quase lá, {nome.trim().split(' ')[0]}!</h2>
                        <p>
                            Seu pedido ainda não foi enviado. Toque no botão abaixo para
                            mandar os dados pelo WhatsApp e confirmar com a barbearia.
                        </p>

                        <dl className="resumo-lista">
                            <div className="resumo-linha">
                                <dt>Serviço</dt>
                                <dd>{servico.nome}</dd>
                            </div>
                            <div className="resumo-linha">
                                <dt>Barbeiro</dt>
                                <dd>{barbeiro}</dd>
                            </div>
                            <div className="resumo-linha">
                                <dt>Data</dt>
                                <dd>{formatarData(data)}</dd>
                            </div>
                            <div className="resumo-linha">
                                <dt>Horário</dt>
                                <dd>{horario}</dd>
                            </div>
                            <div className="resumo-linha">
                                <dt>Valor</dt>
                                <dd>{formatarPreco(servico.preco)}</dd>
                            </div>
                        </dl>

                        <div className="acoes">
                            <a
                                href={linkWhatsapp}
                                target="_blank"
                                rel="noreferrer"
                                className="botao"
                            >
                                Enviar pelo WhatsApp
                            </a>
                            <button
                                type="button"
                                className="botao contorno-claro"
                                onClick={() => setEnviado(false)}
                            >
                                Alterar dados
                            </button>
                        </div>
                    </section>
                </main>

                <Footer />
            </>
        );
    }

    // FORMULÁRIO
    return (
        <>
            <Navbar />

            <main>
                <section className="card_inicial compacto">
                    <span className="selo">Agendamento</span>
                    <h1>
                        Agende seu <span>horário</span>
                    </h1>
                    <p>
                        Escolha o serviço, o dia e o horário. Atendemos de segunda a
                        sábado, das 09h às 20h.
                    </p>
                </section>

                <div className="agendamento">
                    <form className="painel" onSubmit={enviar} noValidate>
                        {erro && <p className="aviso" role="alert">{erro}</p>}

                        <div className="campo">
                            <label htmlFor="servico">Serviço</label>
                            <select id="servico" value={servicoId} onChange={aoMudarServico}>
                                <option value="">Selecione...</option>
                                {SERVICOS.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.nome} - {formatarPreco(s.preco)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="campo-duplo">
                            <div className="campo">
                                <label htmlFor="barbeiro">Barbeiro</label>
                                <select
                                    id="barbeiro"
                                    value={barbeiro}
                                    onChange={(e) => setBarbeiro(e.target.value)}
                                >
                                    {BARBEIROS.map((b) => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="campo">
                                <label htmlFor="data">Data</label>
                                <input
                                    id="data"
                                    type="date"
                                    min={hojeISO()}
                                    value={data}
                                    onChange={aoMudarData}
                                />
                            </div>
                        </div>

                        <div className="campo">
                            <span className="rotulo">Horário</span>

                            {!data && (
                                <p className="dica">Escolha a data para ver os horários.</p>
                            )}

                            {domingo && (
                                <p className="dica">Não atendemos aos domingos.</p>
                            )}

                            {horarios.length > 0 && (
                                <div className="grade-horarios">
                                    {horarios.map((h) => (
                                        <button
                                            key={h.texto}
                                            type="button"
                                            className={`horario ${horario === h.texto ? 'sel' : ''}`}
                                            disabled={!h.livre}
                                            onClick={() => setHorario(h.texto)}
                                        >
                                            {h.texto}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="campo-duplo">
                            <div className="campo">
                                <label htmlFor="nome">Seu nome</label>
                                <input
                                    id="nome"
                                    type="text"
                                    autoComplete="name"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />
                            </div>

                            <div className="campo">
                                <label htmlFor="telefone">Telefone</label>
                                <input
                                    id="telefone"
                                    type="tel"
                                    autoComplete="tel"
                                    placeholder="(00) 00000-0000"
                                    value={telefone}
                                    onChange={(e) => setTelefone(mascaraTelefone(e.target.value))}
                                />
                            </div>
                        </div>

                        <button type="submit" className="botao botao-form">
                            Continuar
                        </button>
                    </form>

                    <aside className="painel resumo">
                        <h2>Resumo</h2>

                        <dl className="resumo-lista">
                            <div className="resumo-linha">
                                <dt>Serviço</dt>
                                <dd>{servico ? servico.nome : '-'}</dd>
                            </div>
                            <div className="resumo-linha">
                                <dt>Barbeiro</dt>
                                <dd>{barbeiro}</dd>
                            </div>
                            <div className="resumo-linha">
                                <dt>Data</dt>
                                <dd>{data ? formatarData(data) : '-'}</dd>
                            </div>
                            <div className="resumo-linha">
                                <dt>Horário</dt>
                                <dd>{horario || '-'}</dd>
                            </div>
                            <div className="resumo-linha">
                                <dt>Duração</dt>
                                <dd>{servico ? `${servico.duracao} min` : '-'}</dd>
                            </div>
                        </dl>

                        <div className="resumo-total">
                            <span>Total</span>
                            <span className="preco">
                                {servico ? formatarPreco(servico.preco) : '-'}
                            </span>
                        </div>
                    </aside>
                </div>
            </main>

            <Footer />
        </>
    );
}

export default Agendamento;