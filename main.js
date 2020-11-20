require('dotenv').config();

const main = () => {
  console.log('Here we are!');
};

if (require.main === module) {
  main();
}
