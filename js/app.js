(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.from(document.querySelectorAll(s)); };

  // ano no rodape
  var anoEl = $("#ano");
  if (anoEl) anoEl.textContent = new Date().getFullYear();

  // menu mobile
  var nav = $("#nav");
  var toggle = $("#navToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // FAQ accordion
  $$(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    var answer = item.querySelector(".faq-a");
    btn.addEventListener("click", function () {
      var isOpen = item.classList.contains("open");
      // fecha os outros
      $$(".faq-item").forEach(function (other) {
        if (other !== item) {
          other.classList.remove("open");
          other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          other.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  // formulário de captação -> monta mensagem e abre o WhatsApp com os dados
  var WHATSAPP_NUMERO = "5585992989066";
  var leadForm = $("#leadForm");
  if (leadForm) {
    // Faixa de assinantes -> plano recomendado, com só 2-3 destaques (não a
    // lista inteira de módulos) — o objetivo é vender um discurso claro por
    // porte de provedor, não "faz tudo". Mesma régua usada na reorganização
    // dos planos_synk (Básico/Profissional/Avançado/Enterprise).
    var PLANO_POR_FAIXA = {
      "Até 500": {
        nome: "Básico", preco: "R$ 49,90/mês",
        destaques: ["App white label com fatura, PIX e suporte", "Central de Benefícios (nova receita)"],
      },
      "500 a 2.000": {
        nome: "Profissional", preco: "R$ 99,90/mês",
        destaques: ["Pontos e recompensas", "Desbloqueio de confiança", "Sugestão de IA antes de abrir chamado"],
      },
      "2.000 a 5.000": {
        nome: "Avançado", preco: "R$ 119,90/mês",
        destaques: ["Internet Móvel (nova receita)", "Vitrine de Planos (capta cliente novo)"],
      },
      "Mais de 5.000": {
        nome: "Enterprise", preco: "R$ 199,90/mês",
        destaques: ["App Synk TV", "IPTV ao vivo no app do assinante"],
      },
    };

    var leadAssinantesEl = $("#leadAssinantes");
    var planoRecomendadoEl = $("#planoRecomendado");
    function atualizarPlanoRecomendado() {
      if (!leadAssinantesEl || !planoRecomendadoEl) return;
      var plano = PLANO_POR_FAIXA[leadAssinantesEl.value];
      if (!plano) { planoRecomendadoEl.classList.remove("show"); return; }
      planoRecomendadoEl.innerHTML =
        '<div class="pr-eyebrow">Baseado no tamanho da sua base</div>' +
        '<div class="pr-titulo">Plano ' + plano.nome + " — " + plano.preco + "</div>" +
        '<div class="pr-destaques">' + plano.destaques.join(" · ") + "</div>";
      planoRecomendadoEl.classList.add("show");
    }
    if (leadAssinantesEl) {
      leadAssinantesEl.addEventListener("change", atualizarPlanoRecomendado);
      atualizarPlanoRecomendado();
    }

    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = $("#leadNome").value.trim();
      var empresa = $("#leadEmpresa").value.trim();
      var whats = $("#leadWhats").value.trim();
      var email = $("#leadEmail").value.trim();
      var assinantes = $("#leadAssinantes").value;
      var gerenciador = $("#leadGerenciador").value;
      var planoRecomendado = PLANO_POR_FAIXA[assinantes];

      var camposObrigatorios = [
        { el: $("#leadNome"), valor: nome },
        { el: $("#leadEmpresa"), valor: empresa },
        { el: $("#leadWhats"), valor: whats },
      ];
      var valido = true;
      camposObrigatorios.forEach(function (campo) {
        if (!campo.valor) {
          campo.el.style.borderColor = "#E4483C";
          valido = false;
        } else {
          campo.el.style.borderColor = "";
        }
      });
      if (!valido) return;

      var linhas = [
        "Olá! Quero uma demonstração do Synk ISP.",
        "",
        "Nome: " + nome,
        "Provedor: " + empresa,
        "WhatsApp: " + whats,
      ];
      if (email) linhas.push("E-mail: " + email);
      linhas.push("Assinantes: " + assinantes);
      linhas.push("Gerenciador: " + gerenciador);
      if (planoRecomendado) {
        linhas.push("", "Plano recomendado: " + planoRecomendado.nome + " (" + planoRecomendado.preco + ")");
      }

      var mensagem = encodeURIComponent(linhas.join("\n"));
      var success = $("#leadSuccess");
      if (success) success.classList.add("show");

      window.open("https://wa.me/" + WHATSAPP_NUMERO + "?text=" + mensagem, "_blank", "noopener");
    });
  }

  // formulário de "Seja parceiro" -> pré-cadastro real na API (fica pendente
  // até o admin aprovar), diferente do form de captação de provedor acima
  // (que só abre o WhatsApp, sem persistir nada).
  var API_URL = "https://codex-hub-isp-api-production.up.railway.app/v1";

  // Seção de planos: busca os mesmos planos/módulos cadastrados no admin
  // (painel > Planos) em vez de manter uma lista fixa duplicada aqui — muda
  // lá, muda na hora aqui também, sem precisar mexer no código da LP.
  var MODULO_LABEL = {
    beneficios: "Central de Benefícios",
    recompensas: "Pontos e recompensas",
    desbloqueio_confianca: "Desbloqueio de confiança",
    iptv: "IPTV ao vivo no app do assinante",
    app_tv: "App Synk TV (Android TV e celular)",
    planos_moveis: "Internet Móvel (planos de dados)",
    landpage: "Vitrine de Planos — sua página pública",
    ia_suporte: "Sugestão de IA antes de abrir chamado",
  };
  var iconeCheck = '<svg viewBox="0 0 20 20" width="16" height="16"><path d="M4 10.5l3.5 3.5L16 5.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> ';

  // Mostra só o que É NOVO nesse plano em relação ao anterior (no máx. 3
  // itens) — em vez de despejar os 8 módulos, cada card conta uma história
  // curta: "pra quem já tem o básico, o que esse plano soma".
  function montarCardPlano(plano, destaque, ehPrimeiro, novosModulos) {
    var preco = Number(plano.valor_mensalidade).toFixed(2).replace(".", ",");
    var itens = ['<li>' + iconeCheck + 'App white label com faturas e suporte</li>'];
    if (!ehPrimeiro) itens.push('<li>' + iconeCheck + 'Tudo do plano anterior</li>');
    novosModulos.slice(0, 3).forEach(function (m) {
      if (MODULO_LABEL[m]) itens.push('<li>' + iconeCheck + MODULO_LABEL[m] + '</li>');
    });
    var mensagem = encodeURIComponent("Olá, quero começar no plano " + plano.nome + " do Synk");
    return (
      '<article class="pricing-card' + (destaque ? ' featured' : '') + '">' +
        (destaque ? '<span class="pricing-badge">Mais escolhido</span>' : '') +
        '<p class="pricing-name">' + plano.nome + '</p>' +
        '<div class="pricing-price"><strong>R$ ' + preco + '</strong><span>/mês</span></div>' +
        '<ul class="check-list">' + itens.join("") + '</ul>' +
        '<a class="btn ' + (destaque ? "btn-primary" : "btn-outline") + '" href="https://wa.me/' + WHATSAPP_NUMERO + '?text=' + mensagem + '" target="_blank" rel="noopener">Começar no ' + plano.nome + '</a>' +
      '</article>'
    );
  }

  var pricingGrid = $("#pricingGrid");
  if (pricingGrid) {
    fetch(API_URL + "/painel/planos")
      .then(function (res) { return res.json(); })
      .then(function (json) {
        var planos = (json && json.data) || [];
        if (!planos.length) { pricingGrid.innerHTML = ""; return; }
        // "Mais escolhido" = plano do meio da lista (o intermediário costuma
        // ser o de melhor custo-benefício na régua), sem depender de flag no banco.
        var indiceDestaque = Math.min(1, planos.length - 1);
        pricingGrid.innerHTML = planos.map(function (p, i) {
          var modulosAnteriores = i > 0 ? (planos[i - 1].modulos || []) : [];
          var novosModulos = (p.modulos || []).filter(function (m) { return modulosAnteriores.indexOf(m) === -1; });
          return montarCardPlano(p, i === indiceDestaque, i === 0, novosModulos);
        }).join("");
      })
      .catch(function () {
        pricingGrid.innerHTML = '<p style="text-align:center;color:var(--text-mute);grid-column:1/-1;">Não foi possível carregar os planos agora — fale com a gente pelo WhatsApp.</p>';
      });
  }
  var parceiroForm = $("#parceiroForm");
  if (parceiroForm) {
    var parcSubmitBtn = parceiroForm.querySelector(".lead-submit");
    parceiroForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = $("#parcNome").value.trim();
      var cidade = $("#parcCidade").value.trim();
      var uf = $("#parcUf").value.trim();
      var contato = $("#parcContato").value.trim();
      var observacoes = $("#parcObs").value.trim();

      var sucesso = $("#parceiroSuccess");
      var erro = $("#parceiroErro");
      var erroMsg = $("#parceiroErroMsg");
      if (sucesso) sucesso.classList.remove("show");
      if (erro) erro.classList.remove("show");

      var camposObrigatorios = [
        { el: $("#parcNome"), valor: nome },
        { el: $("#parcCidade"), valor: cidade },
        { el: $("#parcUf"), valor: uf },
        { el: $("#parcContato"), valor: contato },
      ];
      var valido = true;
      camposObrigatorios.forEach(function (campo) {
        if (!campo.valor) {
          campo.el.style.borderColor = "#E4483C";
          valido = false;
        } else {
          campo.el.style.borderColor = "";
        }
      });
      if (!valido) return;

      if (parcSubmitBtn) { parcSubmitBtn.disabled = true; parcSubmitBtn.textContent = "Enviando…"; }

      fetch(API_URL + "/parceiros/pre-cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome, cidade: cidade, uf: uf, contato: contato, observacoes: observacoes }),
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (json) {
            if (!res.ok) throw new Error((json && json.message) || "Não foi possível enviar. Tente de novo em instantes.");
            return json;
          });
        })
        .then(function () {
          parceiroForm.reset();
          if (sucesso) sucesso.classList.add("show");
        })
        .catch(function (err) {
          if (erroMsg) erroMsg.textContent = err.message || "Não foi possível enviar. Tente de novo em instantes.";
          if (erro) erro.classList.add("show");
        })
        .finally(function () {
          if (parcSubmitBtn) { parcSubmitBtn.disabled = false; parcSubmitBtn.textContent = "Enviar pré-cadastro"; }
        });
    });
  }

  // revela seções ao rolar (sutil, respeita reduced-motion)
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!prefersReduced && "IntersectionObserver" in window) {
    var revealTargets = $$(".feat-card, .faq-item, .phone-item, .painel-gallery-item");
    revealTargets.forEach(function (el) {
      el.style.opacity = "0";
      el.style.transform = "translateY(14px)";
      el.style.transition = "opacity .5s ease, transform .5s ease";
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(function (el) { io.observe(el); });
  }
})();
