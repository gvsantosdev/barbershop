// Dados da barbearia: edite aqui e as páginas Serviços e Agendamento atualizam sozinhas.

// Número do WhatsApp da barbearia, só dígitos, com 55 + DDD (ex.: '5561999999999').
export const WHATSAPP = '5500000000000';

// Horário de funcionamento (Segunda a Sábado, 09h às 20h)
export const ABERTURA = 9 * 60;
export const FECHAMENTO = 20 * 60;

// Valores e durações são exemplos: troque pelos reais.
export const SERVICOS = [
    {
        id: 'corte',
        nome: 'Corte de cabelo',
        descricao: 'Corte na máquina ou na tesoura, com acabamento e finalização.',
        duracao: 40,
        preco: 45,
    },
    {
        id: 'barba',
        nome: 'Barba',
        descricao: 'Modelagem com toalha quente e navalha para um acabamento preciso.',
        duracao: 30,
        preco: 35,
    },
    {
        id: 'combo',
        nome: 'Corte + Barba',
        descricao: 'O pacote completo: cabelo e barba no mesmo horário, com preço especial.',
        duracao: 70,
        preco: 70,
    },
    {
        id: 'sobrancelha',
        nome: 'Sobrancelha',
        descricao: 'Design na navalha ou na pinça, respeitando o formato do seu rosto.',
        duracao: 15,
        preco: 15,
    },
    {
        id: 'acabamento',
        nome: 'Pezinho e acabamento',
        descricao: 'Retoque rápido nas laterais e na nuca para manter o corte em dia.',
        duracao: 20,
        preco: 20,
    },
    {
        id: 'hidratacao',
        nome: 'Hidratação',
        descricao: 'Tratamento para cabelo e barba, deixando os fios macios e com brilho.',
        duracao: 30,
        preco: 40,
    },
];

// Equipe: cada barbeiro tem o próprio portfólio.
// Troque nomes e especialidades. Para adicionar um barbeiro, copie um bloco e mude o id.
//
// Fotos reais: importe a imagem e coloque em src.
// Ex.: import foto1 from '../assets/portfolio/barbeiro1/foto1.jpg';
//      { src: foto1, legenda: 'Degradê' }
// Enquanto src for null, aparece um bloco listrado no lugar.
export const EQUIPE = [
    {
        id: 'barbeiro-1',
        nome: 'Barbeiro 1',
        especialidade: 'Degradê e cortes modernos',
        fotos: [
            { src: null, legenda: 'Degradê' },
            { src: null, legenda: 'Corte social' },
            { src: null, legenda: 'Pigmentação' },
            { src: null, legenda: 'Corte infantil' },
            { src: null, legenda: 'Platinado' },
            { src: null, legenda: 'Risco e desenho' },
        ],
    },
    {
        id: 'barbeiro-2',
        nome: 'Barbeiro 2',
        especialidade: 'Barba e navalha',
        fotos: [
            { src: null, legenda: 'Barba desenhada' },
            { src: null, legenda: 'Navalhado' },
            { src: null, legenda: 'Corte + Barba' },
            { src: null, legenda: 'Barba longa' },
            { src: null, legenda: 'Sobrancelha' },
            { src: null, legenda: 'Hidratação' },
        ],
    },
];

// Lista usada no formulário de agendamento (montada a partir da equipe).
export const BARBEIROS = ['Sem preferência', ...EQUIPE.map((b) => b.nome)];

export function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}