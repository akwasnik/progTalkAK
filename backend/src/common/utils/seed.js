const path = require('node:path');
const SRC = path.join(process.cwd(), 'src');

const connectToMongo = require(path.join(SRC, 'database', 'index'));
const authService = require(path.join(SRC, 'modules', 'auth', 'auth.service'));
const userService = require(path.join(SRC, 'modules', 'users', 'user.service'));
const topicService = require(path.join(SRC, 'modules', 'topics', 'topic.service'));
const postService = require(path.join(SRC, 'modules', 'posts', 'post.service'));

const userRepository = require(path.join(SRC, 'modules', 'users', 'user.repository'));

async function ensureAdmin() {
  const adminLogin = 'admin@admin.pl';
  const exists = await userRepository.findByLogin(adminLogin);
  if (exists) {
    console.log('Admin exists:', adminLogin);
    return exists;
  }

  console.log('Creating admin...');
  const admin = await authService.registerAdmin({ login: adminLogin, password: 'admin123' });
  return admin;
}

async function ensureUsers() {
  const sample = [
    { login: 'alice@example.com', password: 'password' },
    { login: 'bob@example.com', password: 'password' },
    { login: 'charlie@example.com', password: 'password' }
  ];

  const created = [];
  for (const u of sample) {
    let exists = await userRepository.findByLogin(u.login);
    if (!exists) {
      const reg = await authService.register({ login: u.login, password: u.password });
      await userService.setAllowed(reg._id, true);
      exists = reg;
      console.log('Created user:', u.login);
    } else {
      await userService.setAllowed(exists._id, true);
      console.log('User exists:', u.login);
    }
    created.push(exists);
  }
  return created;
}

async function ensureTopics(adminLogin) {
  const names = [
    { name: 'General', description: 'Ogólne dyskusje' },
    { name: 'Programming', description: 'Programowanie i technologie' },
    { name: 'News', description: 'Aktualności' }
  ];

  const existing = await topicService.getAll();
  const map = {};
  for (const t of existing) map[t.name] = t;

  const created = {};
  for (const t of names) {
    if (map[t.name]) {
      created[t.name] = map[t.name];
      console.log('Topic exists:', t.name);
      continue;
    }

    const top = await topicService.createTopic({ name: t.name, description: t.description }, adminLogin);
    created[t.name] = top;
    console.log('Topic created:', t.name);
  }

  const allTopics = await topicService.getAll();
  const findByNameAndParent = (name, parentId) =>
    allTopics.find((x) => {
      const p = x.parent ? x.parent.toString() : null;
      return x.name === name && p === (parentId ? parentId.toString() : null);
    });

  const programming = created['Programming'] || findByNameAndParent('Programming', null);
  if (programming) {
    let web = findByNameAndParent('Web Development', programming._id);
    if (!web) {
      web = await topicService.createTopic(
        { name: 'Web Development', description: 'Frontend i backend web', parent: programming._id },
        adminLogin
      );
      allTopics.push(web);
      created['Programming/Web Development'] = web;
      console.log('Created subtopic: Web Development');
    } else {
      created['Programming/Web Development'] = web;
      console.log('Subtopic exists: Web Development');
    }

    if (web) {
      let backend = findByNameAndParent('Backend', web._id);
      if (!backend) {
        backend = await topicService.createTopic(
          { name: 'Backend', description: 'Backend development', parent: web._id },
          adminLogin
        );
        allTopics.push(backend);
        created['Programming/Web Development/Backend'] = backend;
        console.log('Created subtopic: Backend');
      } else {
        created['Programming/Web Development/Backend'] = backend;
        console.log('Subtopic exists: Backend');
      }

      if (backend) {
        let nodejs = findByNameAndParent('Node.js', backend._id);
        if (!nodejs) {
          nodejs = await topicService.createTopic(
            { name: 'Node.js', description: 'Node.js specific discussions', parent: backend._id },
            adminLogin
          );
          allTopics.push(nodejs);
          created['Programming/Web Development/Backend/Node.js'] = nodejs;
          console.log('Created subtopic: Node.js');
        } else {
          created['Programming/Web Development/Backend/Node.js'] = nodejs;
          console.log('Subtopic exists: Node.js');
        }
      }
    }
  }

  return created;
}

async function createPosts(topics, users) {
  const topicEntries = Object.entries(topics);
  if (topicEntries.length === 0 || users.length === 0) return;

  const postsByCategory = {
    General: [
      'Witajcie na forum! Miło was tutaj widzieć.',
      'Jakie macie plany na ten tydzień?',
      'Ktoś próbował nowego edytora kodu?',
      'Czy używacie jakichś narzędzi do zarządzania czasem?',
      'Polecam ciekawą książkę o produktywności programistów.',
      'Jakie macie doświadczenia z pracą zdalną?',
      'Co sądzicie o pair programmingu?',
      'Mój setup do pracy: monitor 34", mechaniczna klawiatura, ergonomiczne krzesło.',
      'Czy ktoś był na ostatniej konferencji IT?',
      'Jakie podcasts o technologii polecacie?',
      'Właśnie skończyłem kurs online - warto inwestować w edukację.',
      'Ciekawa dyskusja o przyszłości AI w programowaniu.',
      'Jakie IDE używacie na co dzień?',
      'VS Code vs WebStorm - co wybieracie?',
      'Jak radzicie sobie z wypaleniem zawodowym?',
      'Najlepsze praktyki code review - dzielcie się doświadczeniami.',
      'Czy ktoś próbował programowania w Rust?',
      'Jakie certyfikaty IT mają sens w 2026?',
      'Porady dla juniorów wchodzących do branży.',
      'Jak wygląda wasz typowy dzień pracy?',
      'Czy używacie Pomodoro Technique?',
      'Jakie narzędzia do notatek polecacie? Obsidian? Notion?',
      'Dyskusja: monorepo vs polyrepo',
      'Co sądzicie o low-code/no-code platformach?',
      'Jakie są wasze ulubione projekty open source?',
      'Kto tutaj programuje hobbystycznie po godzinach?',
      'Wasze top 3 rozszerzenia do VS Code?',
      'Ile czasu dziennie spędzacie na pisaniu kodu vs meetings?',
      'Jak dokumentujecie swoje projekty?',
      'Czy używacie GitHub Copilot? Warto?',
      'Stack Overflow vs ChatGPT - co częściej używacie?',
      'Dzielcie się swoimi projektami side-project!',
      'Jak przygotowujecie się do rozmów kwalifikacyjnych?',
      'Co sądzicie o czterodniowym tygodniu pracy?',
      'Jakie systemy operacyjne używacie? Linux, Mac, Windows?',
      'Tips & tricks dotyczące terminala.',
      'Najczęstsze błędy początkujących programistów.',
      'Jak nauczyliście się programować?',
      'Czy warto iść na studia informatyczne?',
      'Wasze ulubione repozytorium na GitHubie?',
      'Jaki język programowania polecilibyście na start?',
      'Dyskusja o etyce w AI.',
      'Jakie nawyki pomagają wam w codziennej pracy?',
      'Co was najbardziej irytuje w pracy programisty?',
      'Dzisiejszy fun fact z informatyki.',
    ],
    Programming: [
      'Jakie frameworki JS są teraz najbardziej popularne?',
      'React vs Vue vs Angular - co wybieracie w 2026?',
      'Kto próbował Bun zamiast Node.js?',
      'TypeScript - czy warto przechodzić z czystego JS?',
      'Polecam bibliotekę Zod do walidacji schematów.',
      'Jak radzicie sobie z zarządzaniem stanem w dużych aplikacjach?',
      'Czy ktoś używa Svelte w produkcji?',
      'Design patterns w JavaScript - jakie stosujecie najczęściej?',
      'Deno 2.0 - czy ktoś migrował?',
      'Microservices vs monolith - kiedy co stosować?',
      'GraphQL vs REST - wasze doświadczenia?',
      'Jak testujecie swoje aplikacje? Jest, Vitest, Playwright?',
      'CI/CD pipeline - jakie narzędzia polecacie?',
      'Docker w codziennej pracy developera.',
      'Kubernetes - czy to overkill dla małych projektów?',
      'Git flow vs trunk based development.',
      'Jak optymalizujecie wydajność aplikacji webowych?',
      'WebAssembly - przyszłość czy nisza?',
      'Serverless vs tradycyjny backend - co wybieracie?',
      'Najlepsze praktyki w projektowaniu API.',
      'Czy ktoś używa htmx? Jakie wrażenia?',
      'Event-driven architecture - kiedy stosować?',
      'Polecam narzędzie Turborepo do monorepo.',
      'Jak zarządzacie migracjami bazy danych?',
      'ORM vs raw SQL - co preferujecie?',
      'Redis jako cache - implementacja i dobre praktyki.',
      'Message queues: RabbitMQ vs Kafka.',
      'Jak implementujecie autentykację w swoich projektach?',
      'JWT vs session-based auth - zalety i wady.',
      'OAuth 2.0 - najczęstsze pułapki.',
      'Czy używacie feature flags w swoich projektach?',
      'Monitoring aplikacji - Grafana, Prometheus?',
      'Logging best practices - Winston, Pino?',
      'Clean architecture w Node.js - jak to robicie?',
      'SOLID principles w praktyce.',
      'Refactoring legacy code - strategie i narzędzia.',
      'Jak radzicie sobie z technical debt?',
      'Progressive Web Apps - czy warto w 2026?',
      'SSR vs CSR vs SSG - kiedy co wybrać?',
      'Astro framework - kto używa?',
      'Tailwind CSS vs styled-components - co wybieracie?',
      'Accessibility (a11y) - jak testujecie?',
      'Web performance metrics: LCP, FID, CLS.',
      'Bezpieczeństwo aplikacji webowych - OWASP Top 10.',
      'Jak implementujecie rate limiting?',
      'WebSockets vs Server-Sent Events.',
      'Caching strategies - kiedy jaka?',
      'Jak strukutryzujecie duże projekty Express/Fastify?',
      'Error handling patterns w Node.js.',
      'Dependency injection w JavaScript - potrzebne?',
    ],
    News: [
      'Nowa wersja Node.js 24 LTS - co nowego?',
      'Vue 4 zapowiedziane - najważniejsze zmiany.',
      'GitHub wprowadził nowe funkcje AI do code review.',
      'TypeScript 6.0 - przegląd nowości.',
      'Bun osiągnął wersję 2.0 - czy zastąpi Node?',
      'Nowe standardy ECMAScript 2026 zatwierdzone.',
      'Docker Desktop zmienia model licencjonowania.',
      'MongoDB 8.0 - co nowego w najnowszej wersji?',
      'Rust rośnie w popularności - raport Stack Overflow.',
      'Cloudflare Workers rozszerza darmowy tier.',
      'Vercel ogłasza nowe plany cenowe.',
      'Deno 3.0 na horyzoncie - co wiemy?',
      'Linux Kernel 7.0 wydany.',
      'Firefox wraca do gry z nowym silnikiem.',
      'OpenAI udostępnia nowe API do embeddings.',
      'Meta wydaje nowy framework do budowania UI.',
      'Amazon AWS wprowadza nowe regiony w Europie.',
      'Vite 7 - szybsze buildy i nowe funkcje.',
      'ESLint 10 - flat config jako jedyna opcja.',
      'Nowy raport Octoverse od GitHub.',
      'Netlify vs Vercel vs Cloudflare Pages - porównanie 2026.',
      'WebGPU oficjalnie wspierane we wszystkich przeglądarkach.',
      'Svelte 5 runes - pierwsze wrażenia community.',
      'PostgreSQL 18 beta - przegląd nowych funkcji.',
      'Tailwind CSS v4 - rewolucja czy ewolucja?',
      'Apple Silicon M5 - benchmarki dla developerów.',
      'Chrome 130 wprowadza nowe Web API.',
      'Next.js 16 - server components dojrzały.',
      'Remix vs Next.js - stan w 2026.',
      'Nowy certyfikat AWS dla cloud developerów.',
      'Stack Overflow zmienia strategię - więcej AI.',
      'JetBrains wprowadza AI assistant do wszystkich IDE.',
      'Python 3.15 z nowym GIL - co to zmienia?',
      'npm vs pnpm vs yarn - benchmarki 2026.',
      'Supabase ogłasza nowe funkcje realtime.',
      'Astro 5.0 - content layer API.',
      'Baza danych Turso (libSQL) zyskuje popularność.',
      'Nowe regulacje UE dotyczące open source.',
      'GitHub Copilot X - co nowego?',
      'Konferencja Google I/O 2026 - podsumowanie.',
      'Microsoft Build 2026 - najważniejsze ogłoszenia.',
      'Apple WWDC 2026 - nowe narzędzia dla developerów.',
      'Nowy standard HTTP/3 szeroko adoptowany.',
      'Edge computing - trendy i prognozy.',
      'Raport wynagrodzeń IT w Polsce 2026.',
    ],
    'Programming/Web Development': [
      'Jak strukturyzujecie projekty frontendowe?',
      'Component-driven development - najlepsze praktyki.',
      'Responsive design w 2026 - container queries.',
      'CSS nesting natywnie w przeglądarkach!',
      'Jak testujecie responsywność?',
      'Fetch API vs Axios - co wybieracie?',
      'SPA vs MPA - kiedy co ma sens?',
      'Jak optymalizujecie bundle size?',
      'Lazy loading images i komponentów.',
      'Web Workers do ciężkich obliczeń w przeglądarce.',
      'Service Workers i offline-first approach.',
      'Formularze w web apps - najlepsze biblioteki.',
      'Internacjonalizacja (i18n) - jak to robicie?',
      'Dark mode implementation - najlepsze podejście.',
      'CSS Grid vs Flexbox - kiedy co?',
      'Animacje w webie: CSS, Framer Motion, GSAP?',
      'SEO dla Single Page Applications.',
      'Jak implementujecie infinite scroll?',
      'State management: Pinia vs Vuex vs Zustand.',
      'Authentication flow w SPA - best practices.',
      'File upload w aplikacjach webowych.',
      'Real-time features z WebSockets.',
      'Optimistic updates w UI - jak implementujecie?',
      'Error boundaries i obsługa błędów w UI.',
      'Jak robicie deploy frontendu?',
      'Monorepo dla frontend + backend.',
      'Design system - jak budujecie?',
      'Storybook do dokumentacji komponentów.',
      'Visual regression testing.',
      'Micro-frontends - kiedy mają sens?',
      'Web Components vs framework components.',
      'Headless CMS - które polecacie?',
      'JAMstack w 2026 - czy jeszcze żyje?',
      'Image optimization - sharp, squoosh?',
      'font-display strategies dla web fonts.',
      'Preloading i prefetching zasobów.',
      'Content Security Policy - implementacja.',
      'CORS - najczęstsze problemy i rozwiązania.',
      'HTTP caching headers - cheat sheet.',
      'Debugging narzędzia w Chrome DevTools.',
      'Performance profiling frontendu.',
      'Memory leaks w JavaScript - jak wykrywać?',
      'Strategie cache busting.',
      'Jak mierzycie Core Web Vitals?',
      'A/B testing na frontendzie.',
    ],
    'Programming/Web Development/Backend': [
      'Express vs Fastify vs Koa - benchmarki 2026.',
      'Middleware patterns w Node.js.',
      'Jak strukturyzujecie backend w Express?',
      'Database connection pooling - best practices.',
      'API versioning strategies.',
      'Rate limiting implementation w Node.js.',
      'Input validation - Joi vs Zod vs express-validator.',
      'Error handling middleware patterns.',
      'Logging z Winston/Pino - konfiguracja produkcyjna.',
      'Health check endpoints - co monitorować?',
      'Graceful shutdown w Node.js.',
      'Cluster mode vs PM2 vs Docker scaling.',
      'File uploads z multer - duże pliki.',
      'Background jobs: Bull, Agenda, node-cron.',
      'Email sending: Nodemailer, SendGrid, Resend.',
      'PDF generation w Node.js.',
      'Image processing server-side.',
      'Streaming responses w Express.',
      'Server-Sent Events implementation.',
      'WebSocket scaling z Redis adapter.',
      'Database indexes - kiedy i jakie?',
      'MongoDB aggregation pipeline tips.',
      'Mongoose vs native MongoDB driver.',
      'Transaction handling w MongoDB.',
      'Data migration strategies.',
      'Seeding bazy danych - jak to robicie?',
      'Pagination: offset vs cursor.',
      'Full-text search: MongoDB Atlas vs Elasticsearch.',
      'Caching z Redis - patterns.',
      'Session management w distributed systems.',
      'API documentation: Swagger/OpenAPI.',
      'Request/response compression.',
      'HTTPS i certyfikaty SSL w Node.js.',
      'Environment variables management.',
      'Config management: dotenv vs node-config.',
      'Testing backend: supertest, nock.',
      'Integration tests vs unit tests w API.',
      'Mocking external services w testach.',
      'Database testing - in-memory MongoDB.',
      'Load testing z k6 lub Artillery.',
      'Security headers: helmet.js.',
      'SQL injection prevention w Node.js.',
      'XSS prevention server-side.',
      'CSRF protection implementation.',
      'Dependency update strategy.',
      'Node.js memory management.',
      'Event loop - jak działa i jak nie blokować.',
      'Async/await error handling patterns.',
      'TypeScript w backend - warto?',
      'NestJS vs Express - kiedy co?',
    ],
    'Programming/Web Development/Backend/Node.js': [
      'Node.js 24 LTS - przegląd nowych features.',
      'Native fetch w Node - czy porzucacie axios?',
      'Node.js test runner - alternatywa dla Jest?',
      'Permission model w Node.js - bezpieczeństwo.',
      'Single executable applications w Node.',
      'node:crypto - hashowanie i szyfrowanie.',
      'Streams w Node.js - praktyczne zastosowania.',
      'Child processes vs Worker threads.',
      'Node.js debugger - nie tylko console.log!',
      'V8 engine updates affecting Node.js.',
      'ESM vs CJS - migracja modułów.',
      'Package.json exports field.',
      'Corepack i zarządzanie package managerami.',
      'Node.js i WebAssembly.',
      'Profiling Node.js apps z clinic.js.',
      'Memory leaks w Node - heap snapshots.',
      'Libuv - understanding the event loop.',
      'node:fs promises API - best practices.',
      'node:path - cross-platform paths.',
      'Error handling: operational vs programmer errors.',
      'Custom error classes w Node.js.',
      'Middleware chain pattern w Express.',
      'Router organization w dużych aplikacjach.',
      'Dependency injection bez frameworków.',
      'Singletons w Node.js - antipattern?',
      'node:util - przydatne narzędzia.',
      'Timers w Node.js - setTimeout vs setImmediate.',
      'Process signals handling: SIGTERM, SIGINT.',
      'Dotenv vs environment w Docker.',
      'node:crypto randomUUID - generowanie ID.',
      'Buffer vs TypedArray w Node.js.',
      'Konfiguracja production Node.js server.',
      'Deploying Node.js z Docker - best practices.',
      'Dockerfile dla Node.js - multi-stage build.',
      'Node.js security checklist.',
      'Updating Node.js - strategia w zespole.',
      'nvm vs fnm vs volta - wersjonowanie Node.',
      'npx vs pnpx vs bunx.',
      'Monorepo z npm workspaces.',
      'Publishing pakietów na npm.',
      'Semantic versioning w praktyce.',
      'Node.js performance tips kompilacja V8.',
      'Jak Node.js radzi sobie z CPU-intensive tasks?',
      'Porównanie Node.js z Go dla mikroserwisów.',
      'Express 5.0 - co się zmienia?',
      'Fastify plugins ecosystem.',
      'tRPC z Node.js backend.',
      'GraphQL w Node - Apollo vs Yoga.',
      'REST API design w Node.js.',
      'HATEOAS w praktyce z Express.',
    ],
  };

  const defaultPosts = [
    'Ciekawy temat - chętnie podyskutuję!',
    'Mam pytanie do tego tematu...',
    'Dzięki za utworzenie tego wątku.',
    'Czy ktoś ma doświadczenie w tej kwestii?',
    'Ciekawe spostrzeżenie, zgadzam się.',
    'Mam inne zdanie - pozwólcie, że się podzielę.',
    'To bardzo przydatna informacja!',
    'Właśnie szukałem czegoś takiego.',
    'Czy możesz podać jakiś przykład?',
    'Super temat do dyskusji.',
    'Ciekawe podejście, muszę to przetestować.',
    'Dzięki za podzielenie się wiedzą!',
    'To mi przypomina sytuację z mojego projektu...',
    'Mam podobne doświadczenia.',
    'Czy ktoś próbował innego podejścia?',
    'To interesująca perspektywa.',
    'Polecam też zajrzeć do dokumentacji.',
    'Znakomity punkt - nie pomyślałem o tym.',
    'Mam kilka uwag do tego tematu.',
    'Bardzo merytoryczna dyskusja!',
    'Właśnie tego szukałem - dzięki!',
    'Muszę to wypróbować w moim projekcie.',
    'Ktoś ma linka do bardziej szczegółowego opisu?',
    'To powinno być sticky postem!',
    'Wrócę tu z wynikami moich testów.',
    'Super, że ktoś poruszył ten temat.',
    'Mam kilka pytań uzupełniających...',
    'Chętnie pomogę jeśli ktoś ma pytania.',
    'Dyskusja na poziomie - szacunek!',
    'Dodałbym jeszcze jedno spostrzeżenie...',
    'Potwierdzam - u mnie działa tak samo.',
    'Ciekawe, u mnie wynik jest inny.',
    'Trzeba to przetestować na większej skali.',
    'Ktoś ma benchmarki?',
    'Zgadzam się w 100%.',
    'Mam inne doświadczenia - opiszę poniżej.',
    'To rozwiązanie zaoszczędziło mi dużo czasu.',
    'Warto dodać to do naszego wiki.',
    'Bardzo pomocny wątek!',
    'Czekam na więcej takich dyskusji.',
    'Świetna analiza problemu.',
    'To jest dokładnie mój use-case!',
    'Czy ktoś testował to na produkcji?',
    'Muszę to przekazać mojemu zespołowi.',
    'Notatka do siebie: wrócić tu za tydzień.',
    'Jeden z lepszych wątków na forum.',
    'Kolejny argument za tym podejściem.',
    'Warto się nad tym zastanowić.',
    'Moje doświadczenie jest zbliżone.',
    'Podsumowując - warto spróbować!',
  ];

  const tags = ['javascript', 'node', 'vue', 'mongodb', 'docker', 'css', 'html', 'api', 'git', 'linux', 'express', 'typescript', 'react', 'devops', 'testing'];

  const pickTags = (i) => {
    const count = (i % 4 === 0) ? 0 : (i % 3 === 0) ? 2 : 1;
    const result = [];
    for (let t = 0; t < count; t++) result.push(tags[(i + t * 7) % tags.length]);
    return result;
  };

  let totalCreated = 0;
  for (const [key, topic] of topicEntries) {
    const pool = postsByCategory[key] || defaultPosts;
    const targetCount = 40 + (key.length % 21);

    for (let i = 0; i < targetCount; i++) {
      const user = users[i % users.length];
      const content = pool[i % pool.length];
      await postService.createPost({
        topicId: topic._id,
        login: user.login,
        content,
        tags: pickTags(i)
      });
      totalCreated++;
    }
    console.log(`Created ${targetCount} posts in "${topic.name}"`);
  }
  console.log(`Total posts created: ${totalCreated}`);
}

async function seed() {
  await connectToMongo();

  const admin = await ensureAdmin();
  const users = await ensureUsers();
  const topics = await ensureTopics(admin.login || 'admin');
  await createPosts(topics, users.length ? users : [{ login: 'admin' }]);

  console.log('\nSeeding completed.');
  process.exit(0);
}

seed();
