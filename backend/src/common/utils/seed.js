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
  if (topicEntries.length === 0) return;

  const samplePosts = [
    'Witajcie w temacie!',
    'To jest przykładowy post o Node.js.',
    'Czy ktoś używa MongoDB w produkcji?'
  ];

  for (let i = 0; i < samplePosts.length; i++) {
    const topic = topicEntries[i % topicEntries.length][1];
    const user = users[i % users.length];
    await postService.createPost({ topicId: topic._id, login: user.login, content: samplePosts[i], tags: [] });
    console.log('Post created in', topic.name, 'by', user.login);
  }
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
