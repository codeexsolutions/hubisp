# HUB ISP — Landing page

Landing page institucional do HUB ISP, em HTML/CSS/JS puro (sem build, sem
dependências). Estrutura de seções inspirada na referência que você indicou
(ISPJet), com identidade visual e conteúdo próprios do HUB ISP — mesma
paleta e tipografia já usadas no PWA e no painel do provedor.

## Como abrir

```bash
cd hubisp-landing
python3 -m http.server 8080
# abra http://localhost:8080
```

Ou publique `index.html` + `css/` + `js/` em qualquer hospedagem estática
(Vercel, Netlify, GitHub Pages, ou o próprio servidor do provedor).

## Antes de publicar — troque os placeholders

Três coisas no código são placeholders e precisam da informação real:

1. **WhatsApp** — aparece em 3 lugares (`index.html`), como
   `https://wa.me/5500000000000?text=...`. Troque `5500000000000` pelo
   número real, no formato `55DDDNÚMERO`.
2. **E-mail de contato** — `contato@hubisp.com.br`, no CTA final e no
   rodapé. Troque pelo e-mail real.
3. **Link do painel** — `https://app.hubisp.com.br`, no menu e no rodapé.
   Aponte para a URL real do painel do provedor.

## Seções

1. **Hero** — headline, bullets, CTAs e mockup do app com animação de sinal
   (anéis pulsando, respeitando `prefers-reduced-motion`).
2. **Recursos** — grid de 6 cards com os recursos reais do app: faturas
   Pix/boleto, múltiplos contratos, chamados de suporte, banners/parcerias,
   teste de velocidade, avaliação de satisfação.
3. **White label** — destaque de tema configurável (cor + logo).
4. **Painel do provedor** — mockup do painel (browser + sidebar + stats),
   com os recursos de autogestão.
5. **Telas do app** — galeria de 4 mockups de telefone (login, início,
   pagamento, suporte).
6. **Integração** — selo de integração nativa com RECEITANET (IXCSOFT em
   desenvolvimento).
7. **FAQ** — accordion com 5 perguntas frequentes.
8. **CTA final + rodapé**.

## Testado

- Zero overflow horizontal em 1440px, 1024px, 390px e 360px de largura
  (testado com Playwright + Chromium headless).
- Corrigido um bug real de grid (`grid-template-columns: 1fr` sem
  `minmax(0, ...)`) que forçava a coluna do hero a ficar mais larga que a
  tela no mobile, cortando o texto — aplicado `minmax(0,1fr)` em todos os
  grids da página.
- Menu mobile: abre/fecha corretamente, sem sobreposição entre links e
  botões (reescrito de posicionamento absoluto "no chute" para fluxo normal
  com `flex-wrap`).
- FAQ: abre ao clicar, fecha a pergunta anterior ao abrir outra.
- Todas as âncoras do menu (`#recursos`, `#painel`, `#telas`, `#duvidas`,
  `#contato`) apontam para seções que existem.

## Estrutura

```
hubisp-landing/
├─ index.html
├─ css/style.css
└─ js/app.js       menu mobile, accordion do FAQ, reveal sutil ao rolar
```
