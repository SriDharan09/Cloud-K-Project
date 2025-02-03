const { exec } = require("child_process");

let seeders = [
  "branchesSeeder.js",
  "categoriesSeeder.js",
  "menuItemsSeeder.js",
  "OffersSeeder.js",
  "rolesSeeder.js",
  "usersSeeder.js",
  "CustomizationSeeder.js",
];
 //seeders.splice(-3);
 seeders.splice(-7);

async function runSeeders() {
  for (const seeder of seeders) {
    console.log(`Running seeder: ${seeder}`);
    await new Promise((resolve, reject) => {
      exec(
        `npx sequelize-cli db:seed --seed seeders/${seeder}`,
        (err, stdout, stderr) => {
          if (err) {
            console.error(`Error running ${seeder}:`, stderr);
            reject(err);
          } else {
            console.log(stdout);
            resolve();
          }
        }
      );
    });
    console.log(`⚡ ${seeder} executed successfully! ⚡`);
  }
  console.log("✅ All seeders executed successfully! ✅");
}

runSeeders();
