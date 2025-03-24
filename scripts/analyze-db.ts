import { exec } from "child_process";

console.log("Starting database analysis...");

// Execute the schema export script
exec("npx tsx ./scripts/export-schema.ts", (error, stdout, stderr) => {
  if (error) {
    console.error(`Error exporting schema: ${error.message}`);
    return;
  }

  console.log(stdout);

  // After exporting schema, generate optimized recommendations
  exec("npx tsx ./scripts/generate-optimized-schema.ts", (err, out, stdErr) => {
    if (err) {
      console.error(`Error generating optimizations: ${err.message}`);
      return;
    }

    console.log(out);
    console.log(
      "Database analysis complete. Check the generated files for more information."
    );
  });
});
