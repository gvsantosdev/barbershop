import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

const LINKS = [
    { href: '/', texto: 'Início' },
    { href: '/servicos', texto: 'Serviços' },
];

function Navbar() {
    const [compacta, setCompacta] = useState(false);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        function verificarScroll() {
            setCompacta(window.scrollY > 50);
        }

        verificarScroll();
        window.addEventListener('scroll', verificarScroll);

        return () => {
            window.removeEventListener('scroll', verificarScroll);
        };
    }, []);

    const paginaAtual = window.location.pathname.replace(/\/$/, '') || '/';

    return (
        <nav className={`navbar ${compacta ? 'compacta' : ''}`}>
            <a href="/" className="logo-link" aria-label="Ir para o início">
                <img src={logo} alt="Logo da barbearia" className="logo" />
            </a>

            <button
                type="button"
                className={`menu-botao ${menuAberto ? 'aberto' : ''}`}
                onClick={() => setMenuAberto(!menuAberto)}
                aria-label="Abrir menu"
                aria-expanded={menuAberto}
            >
                <span></span>
                <span></span>
                <span></span>
            </button>

            <div className={`links ${menuAberto ? 'aberto' : ''}`}>
                {LINKS.map((link) => (
                    <a
                        key={link.href}
                        href={link.href}
                        className={paginaAtual === link.href ? 'ativo' : ''}
                        onClick={() => setMenuAberto(false)}
                    >
                        {link.texto}
                    </a>
                ))}

                <a
                    href="/agendamento"
                    className={`cta ${paginaAtual === '/agendamento' ? 'ativo' : ''}`}
                    onClick={() => setMenuAberto(false)}
                >
                    Agendar
                </a>
            </div>
        </nav>
    );
}

export default Navbar;