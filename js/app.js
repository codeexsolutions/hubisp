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
    leadForm.addEventListener("submit", function (e) {
      e.preventDefault();

      var nome = $("#leadNome").value.trim();
      var empresa = $("#leadEmpresa").value.trim();
      var whats = $("#leadWhats").value.trim();
      var email = $("#leadEmail").value.trim();
      var assinantes = $("#leadAssinantes").value;
      var gerenciador = $("#leadGerenciador").value;

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

      var mensagem = encodeURIComponent(linhas.join("\n"));
      var success = $("#leadSuccess");
      if (success) success.classList.add("show");

      window.open("https://wa.me/" + WHATSAPP_NUMERO + "?text=" + mensagem, "_blank", "noopener");
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
