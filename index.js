const { MongoClient } = require('mongodb');
const readline = require('readline');

const uri = 'mongodb://localhost:27017';
const dbName = 'movieDB';
const collectionName = 'movies';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUser() {
  console.log('\nMovie Index CLI - Choose an option:');
  console.log('1. Create index on "title"');
  console.log('2. Find movie by title ("Inception")');
  console.log('3. Delete index on "title"');
  console.log('4. Create index on "genre"');
  console.log('5. Find movies by genre ("Sci-Fi")');
  console.log('6. Exit');
  rl.question('\nEnter your choice (1-6): ', handleChoice);
}

async function handleChoice(choice) {
  switch (choice) {
    case '1':
      await createIndex('title');
      break;
    case '2':
      await findMoviesByTitle('Inception');
      break;
    case '3':
      await deleteIndex('title_1');
      break;
    case '4':
      await createIndex('genre');
      break;
    case '5':
      await findMoviesByGenre('Sci-Fi');
      break;
    case '6':
      rl.close();
      process.exit();
    default:
      console.log('Invalid choice, please try again.');
  }
  promptUser();
}

async function connectToCollection() {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);
  return { client, collection };
}

async function createIndex(field) {
  const { client, collection } = await connectToCollection();
  try {
    const indexName = await collection.createIndex({ [field]: 1 });
    console.log(`Index on "${field}" created: ${indexName}`);
  } catch (err) {
    console.error('Error creating index:', err);
  } finally {
    await client.close();
  }
}

async function deleteIndex(indexName) {
  const { client, collection } = await connectToCollection();
  try {
    const result = await collection.dropIndex(indexName);
    console.log(`Index deleted: ${result}`);
  } catch (err) {
    console.error('Error deleting index:', err);
  } finally {
    await client.close();
  }
}

async function findMoviesByTitle(title) {
  const { client, collection } = await connectToCollection();
  try {
    const movies = await collection.find({ title }).toArray();
    console.log(`Movies with title "${title}":`, movies);
  } catch (err) {
    console.error('Error finding movie:', err);
  } finally {
    await client.close();
  }
}

async function findMoviesByGenre(genre) {
  const { client, collection } = await connectToCollection();
  try {
    const movies = await collection.find({ genre }).toArray();
    console.log(`Sci-Fi Movies:`, movies);
  } catch (err) {
    console.error('Error finding movies by genre:', err);
  } finally {
    await client.close();
  }
}

promptUser();

