// ================================
// CONFIGURAÇÕES GLOBAIS
// ================================

const quizData = [
    {
        pergunta: "Qual é o rio mais importante para a agricultura de Itambaracá?",
        opcoes: ["Rio Paranapanema", "Rio Cinzas", "Rio Paraná", "Rio Tocantins"],
        correta: 0
    },
    {
        pergunta: "O que caracteriza a agricultura sustentável?",
        opcoes: ["Máximo uso de químicos", "Preservação ambiental e eficiência", "Desmatamento controlado", "Monocultura intensiva"],
        correta: 1
    },
    {
        pergunta: "Qual é a principal função da irrigação inteligente?",
        opcoes: ["Aumentar custos", "Economizar água e melhorar eficiência", "Poluir o solo", "Destruir plantações"],
        correta: 1
    },
    {
        pergunta: "Que tecnologia moderna está revolucionando a agricultura?",
        opcoes: ["Drones agrícolas e IA", "Apenas força manual", "Apenas tratores antigos", "Nada novo"],
        correta: 0
    },
    {
        pergunta: "Em qual estado do Brasil fica Itambaracá?",
        opcoes: ["São Paulo", "Mato Grosso", "Paraná", "Minas Gerais"],
        correta: 2
    },
    {
        pergunta: "Qual é a importância econômica do agronegócio para Itambaracá?",
        opcoes: ["Nenhuma importância", "Gera empregos e receita", "Causa apenas problemas", "Não interfere na economia"],
        correta: 1
    },
    {
        pergunta: "O que significa agricultura de precisão?",
        opcoes: ["Plantar aleatoriamente", "Usar tecnologia para otimizar recursos", "Sem usar água", "Plantar sem verificação"],
        correta: 1
    },
    {
        pergunta: "Qual é o benefício da energia solar na propriedade rural?",
        opcoes: ["Aumenta custos", "Reduz custos e é limpa", "Não funciona", "Piora a colheita"],
        correta: 1
    },
    {
        pergunta: "Quantas principais culturas são produzidas em Itambaracá?",
        opcoes: ["Apenas uma", "Duas", "Múltiplas: soja, milho, café, etc.", "Nenhuma"],
        correta: 2
    },
    {
        pergunta: "Qual é o objetivo final deste projeto Agrinho?",
        opcoes: ["Ignorar a agricultura", "Mostrar importância do agro e sustentabilidade", "Prejudicar produtores", "Nenhum objetivo"],
        correta: 1
    }
];

let quizAtual = 0;
let respostasUsuario = [];
let contagemAnimada = false;

// ================================
// INICIALIZAÇÃO
// ================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarNavegacao();
    inicializarQuiz();
    atualizarAnoRodape();
    atualizarDataCotacoes();
    inicializarObserverAnimacoes();
    inicializarParallax();
});

// ================================
// NAVEGAÇÃO E HAMBURGER MENU
// ================================

function inicializarNavegacao() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('ativo');
            hamburger.classList.toggle('ativo');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) navMenu.classList.remove('ativo');
            if (hamburger) hamburger.classList.remove('ativo');
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navMenu && navMenu.contains(event.target);
        const isClickInsideHamburger = hamburger && hamburger.contains(event.target);
        
        if (!isClickInsideNav && !isClickInsideHamburger && navMenu) {
            navMenu.classList.remove('ativo');
            if (hamburger) hamburger.classList.remove('ativo');
        }
    });
}

// ================================
// OBSERVER PARA ANIMAÇÕES NA ROLAGEM
// ================================

function inicializarObserverAnimacoes() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('observado');
                
                // Animação de contadores
                if (entry.target.classList.contains('contador-item')) {
                    animarContadores();
                }
            }
        });
    }, observerOptions);

    // Observar elementos com animação
    document.querySelectorAll('.slide-up').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.contador-item').forEach(el => {
        observer.observe(el);
    });
}

// ================================
// PARALLAX EFFECT
// ================================

function inicializarParallax() {
    window.addEventListener('scroll', function() {
        const parallaxBg = document.querySelector('.parallax-bg');
        if (parallaxBg) {
            const scrollPosition = window.scrollY;
            parallaxBg.style.transform = `translateY(${scrollPosition * 0.5}px)`;
        }
    });
}

// ================================
// QUIZ INTERATIVO
// ================================

function inicializarQuiz() {
    const quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    exibirPergunta();
}

function exibirPergunta() {
    const quizContainer = document.getElementById('quiz-conteudo');
    const numeroContainer = document.getElementById('quiz-numero');
    const progressBar = document.getElementById('quiz-progress');

    if (!quizContainer) return;

    const perguntaAtual = quizData[quizAtual];
    
    // Atualizar número da pergunta e progresso
    numeroContainer.textContent = quizAtual + 1;
    const percentual = ((quizAtual + 1) / quizData.length) * 100;
    progressBar.style.width = percentual + '%';

    // Criar HTML da pergunta
    let html = `
        <div class="pergunta">${perguntaAtual.pergunta}</div>
        <div class="opcoes">
    `;

    perguntaAtual.opcoes.forEach((opcao, index) => {
        html += `
            <label class="opcao">
                <input type="radio" name="resposta" value="${index}" onchange="selecionarResposta(${index})">
                ${opcao}
            </label>
        `;
    });

    html += `
        </div>
        <div style="display: flex; gap: 1rem; justify-content: center;">
    `;

    if (quizAtual > 0) {
        html += `<button class="btn btn-secondary" onclick="voltarPergunta();">Anterior</button>`;
    }

    if (quizAtual < quizData.length - 1) {
        html += `<button class="btn btn-primary" onclick="proximaPergunta();">Próxima</button>`;
    } else {
        html += `<button class="btn btn-primary" onclick="finalizarQuiz();">Finalizar Quiz</button>`;
    }

    html += `</div>`;

    quizContainer.innerHTML = html;

    // Restaurar resposta anterior se existir
    if (respostasUsuario[quizAtual] !== undefined) {
        const radioSelecionado = document.querySelector(`input[value="${respostasUsuario[quizAtual]}"]`);
        if (radioSelecionado) {
            radioSelecionado.checked = true;
            radioSelecionado.parentElement.classList.add('selected');
        }
    }
}

function selecionarResposta(index) {
    respostasUsuario[quizAtual] = index;
    
    // Adicionar classe ao elemento
    document.querySelectorAll('.opcao').forEach((opcao, i) => {
        if (i === index) {
            opcao.classList.add('selected');
        } else {
            opcao.classList.remove('selected');
        }
    });
}

function proximaPergunta() {
    if (respostasUsuario[quizAtual] === undefined) {
        alert('Por favor, selecione uma resposta!');
        return;
    }
    quizAtual++;
    exibirPergunta();
}

function voltarPergunta() {
    if (quizAtual > 0) {
        quizAtual--;
        exibirPergunta();
    }
}

function finalizarQuiz() {
    if (respostasUsuario[quizAtual] === undefined) {
        alert('Por favor, selecione uma resposta!');
        return;
    }

    // Calcular resultado
    let acertos = 0;
    respostasUsuario.forEach((resposta, index) => {
        if (resposta === quizData[index].correta) {
            acertos++;
        }
    });

    const percentual = (acertos / quizData.length) * 100;
    let mensagem = '';

    if (percentual === 100) {
        mensagem = '🏆 Excelente! Você é um especialista em agricultura!';
    } else if (percentual >= 80) {
        mensagem = '⭐ Muito bom! Você conhece bem sobre agricultura!';
    } else if (percentual >= 60) {
        mensagem = '👍 Bom! Continue aprendendo sobre sustentabilidade!';
    } else if (percentual >= 40) {
        mensagem = '📚 Você está aprendendo! Estude mais sobre agricultura!';
    } else {
        mensagem = '💪 Continue estudando, você consegue!';
    }

    // Exibir resultado
    document.getElementById('quiz-conteudo').innerHTML = `
        <div class="quiz-resultado">
            <div class="resultado-score">${acertos}/${quizData.length}</div>
            <div class="resultado-mensagem">${mensagem}</div>
            <div class="resultado-detalhes">
                <p><strong>Pontuação:</strong> ${percentual.toFixed(1)}%</p>
                <p><strong>Acertos:</strong> ${acertos}</p>
                <p><strong>Erros:</strong> ${quizData.length - acertos}</p>
            </div>
            <button class="btn btn-primary" onclick="reiniciarQuiz();">Refazer Quiz</button>
        </div>
    `;

    document.getElementById('quiz-numero').parentElement.style.display = 'none';
}

function reiniciarQuiz() {
    quizAtual = 0;
    respostasUsuario = [];
    document.getElementById('quiz-numero').parentElement.style.display = 'block';
    exibirPergunta();
}

// ================================
// CONTADORES ANIMADOS
// ================================

function animarContadores() {
    if (contagemAnimada) return;
    contagemAnimada = true;

    document.querySelectorAll('.contador-numero').forEach(elemento => {
        const alvo = parseInt(elemento.getAttribute('data-target'));
        let atual = 0;
        const incremento = Math.ceil(alvo / 100);
        
        const intervalo = setInterval(() => {
            atual += incremento;
            if (atual >= alvo) {
                atual = alvo;
                clearInterval(intervalo);
            }
            elemento.textContent = atual.toLocaleString('pt-BR');
        }, 20);
    });
}

// ================================
// GALERIA E FILTROS
// ================================

function filtrarGaleria(categoria) {
    const itens = document.querySelectorAll('.galeria-item');
    const botoes = document.querySelectorAll('.filtro-btn');

    // Atualizar botões ativos
    botoes.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // Filtrar itens
    itens.forEach(item => {
        if (categoria === 'todos' || item.getAttribute('data-categoria') === categoria) {
            item.classList.remove('hidden');
            setTimeout(() => {
                item.style.opacity = '1';
            }, 10);
        } else {
            item.classList.add('hidden');
        }
    });
}

// ================================
// COTAÇÕES E ATUALIZAÇÃO
// ================================

function atualizarDataCotacoes() {
    const hoje = new Date();
    const opcoes = { year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = hoje.toLocaleDateString('pt-BR', opcoes);
    
    const dataElement = document.getElementById('data-atual');
    if (dataElement) {
        dataElement.textContent = dataFormatada;
    }
}

function atualizarCotacoes() {
    // Simular atualização de cotações
    // Em produção, isso seria integrado com uma API real
    
    const cotacoes = [
        { id: 'soja', preco: 65.50, variacao: 2.5 },
        { id: 'milho', preco: 38.20, variacao: 1.8 },
        { id: 'cafe', preco: 450.00, variacao: -0.5 },
        { id: 'trigo', preco: 42.30, variacao: 0.3 },
        { id: 'feijao', preco: 85.50, variacao: -1.2 }
    ];

    // Simular flutuação de preços (±5%)
    cotacoes.forEach(cotacao => {
        const flutuacao = (Math.random() - 0.5) * 10;
        const novoPreco = cotacao.preco + flutuacao;
        const novaVariacao = ((novoPreco - cotacao.preco) / cotacao.preco * 100).toFixed(1);

        document.getElementById(`preco-${cotacao.id}`).textContent = `R$ ${novoPreco.toFixed(2)}`;
        document.getElementById(`var-${cotacao.id}`).textContent = `${novaVariacao}%`;
    });

    atualizarDataCotacoes();
    
    // Feedback visual
    alert('Cotações atualizadas com sucesso!');
}

// ================================
// RODAPÉ
// ================================

function atualizarAnoRodape() {
    const anoAtual = new Date().getFullYear();
    const elemento = document.getElementById('ano-atual');
    if (elemento) {
        elemento.textContent = anoAtual;
    }
}

// ================================
// SMOOTH SCROLL PARA LINKS ÂNCORA
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ================================
// EFEITOS DE MOUSE NOS CARDS
// ================================

document.querySelectorAll('.card, .card-agro, .sustentavel-card, .curiosidade-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ================================
// ANIMAÇÃO DE SCROLL
// ================================

window.addEventListener('scroll', function() {
    // Verificar se nav deve ter sombra
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
    } else {
        navbar.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
    }
});

// ================================
// VALIDAÇÃO E OTIMIZAÇÕES
// ================================

// Lazy loading para imagens (quando tiver imagens reais)
if ('IntersectionObserver' in window) {
    const imagensLazy = document.querySelectorAll('img[data-lazy]');
    const observadorImagens = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.getAttribute('data-lazy');
                img.removeAttribute('data-lazy');
                observadorImagens.unobserve(img);
            }
        });
    });

    imagensLazy.forEach(img => observadorImagens.observe(img));
}

// Log de inicialização
console.log('✅ Site Agro Forte carregado com sucesso!');
console.log('📍 Desenvolvido para Concurso Agrinho 2026');
console.log('🌱 Tema: Agro Forte - Sustentabilidade, Tecnologia e Desenvolvimento em Itambaracá');
