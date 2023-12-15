# 🔍 FiscalizaJá Deputados
Seja bem-vindo! 👋

Este é o website oficial do FiscalizaJá Deputados. Feito com Astro + React + 💙

# 🙋‍♂️ A diferença começa aqui.
Eu sou Victor Reis David. Um jovem programador de 17 anos que visa fazer diferença no mundo contemporâneo.

Programação me tirou da depressão e abriu meus olhos. Hoje eu faço uso da mesma para abrir os olhos do mundo.

Este projeto foi desenvolvido com muito carinho para ser um pedacinho de contribuição para um futuro melhor para a nossa geração ❤

Não deixe que o "julgamento pela capa" te cegue! Este repositório tem um altíssimo valor para a sociedade brasileira. E seria uma honra ver forks aperfeiçoando e dando origem a novos produtos e ideias. Estão a vontade para clonar e fazerem suas versões modificadas, vai com tudo galera!

Só não apague o verdadeiro objetivo do FiscalizaJá...

## 🤨 Por que Astro?
Astro é um framework moderno, simples porém poderoso. É focado em conteúdo estático (suporta SSR) e possui alta performance.

Isso é explicado porquê o site tem alta pontuação em performance, somente o que é necessário ser interativo que é renderizado com JS, o resto é HTML estático!

**Vantagens em migrar do Next.js para o Astro**
- **Simples, performático, poderoso**: O Astro combina simplicidade com elegância, que rapidamente conquistou meu coração.
- **Use sem abrir mão do seu framework UI preferido**: O Astro funciona com uma gama de frameworks UI: React, Angular, Vue, Svelte, etc. No meu caso que amo React, foi uma mão na roda!!

Desenvolver com Astro aqui foi uma experiência incrível e eu te convido a conhecer o framework, se ainda não conhece! https://astro.build

## 🔑 Variáveis de ambiente
A única variável de ambiente é `PUBLIC_API_URL`.

```bash
PUBLIC_API_URL="http://127.0.0.1:3000"
```

Você pode defini-lá no seu ambiente ou fazer um arquivo `.env`.

A url da API apontada na variável deve ser para uma URL válida do [serviço rest do FiscalizaJá Deputados](https://github.com/FiscalizaJa/FiscalizaJa-Deputados-Rest).

## 🚀 Selfhosting
As etapas para selfhosting de uma aplicação Astro são parecidas com a de uma aplicação Next.js, porém, tem algumas diferenças:

- O Astro gera somente HTML estático! Que dizer que não tem nativamente um webserver, como o Next.

Devido a isso, precisamos de algo que se chama `adapters`! Exatamente, para cada ambiente de runtime haverá um adapter: `@astrojs/vercel`, `@astrojs/cloudflare`, etc.

Para o nosso caso, nós precisamos do `@astrojs/node`, pois não estamos em um runtime serverless (no entanto, você pode migrar facilmente para a Vercel ou outra plataforma!).

- O `@astrojs/node` é responsável por criar um webserver para nós, que poderá servir tanto as páginas estáticas quanto as dinâmicas (ssr), que são as dos deputados.

Se você for apenas testar, pode usar o modo de desenvolvimento: `npx astro dev`.

### 🙆‍♂️ Iniciando o webserver
Antes de tudo, você deve compilar as páginas com `npx astro build`.

Isso irá gerar todas as páginas estáticas e a runtime do webserver, que agora entra a diferença para o Nextjs.

- No Nextjs, seria necessário somente usar `npx next start -p $PORT` apóis isso, que o servidor iniciaria.

No astro, é diferente:

- Você vai ver uma pasta chamada `dist` no seu diretório, navegue para dentro dela.
    - Dentro haverá duas pastas: `client` e `server`. O que nos interessa é a pasta `server`.
        - Dentro de `server` haverá um arquivo chamado `entry.mjs`, é ele que você deve rodar!

```bash
node server/entry.mjs
```

Feito isso, seu servidor está no ar!

Recomendável: deixar atrás de um proxy reverso como o NGINX e usar uma ferramenta como o `pm2` para usar clustering.

# 👐 Contribuições
O projeto é totalmente aberto a contribuições, serão todas bem-vindas e contribuirão para a esperança de um dia o Brasil mudar.