import { supabase } from "../lib/supabase";

// Function to export schema information
async function exportSchema() {
  try {
    console.log("Exporting database schema...");

    // Get all tables
    const { data: tables, error: tablesError } = await supabase
      .from("pg_tables")
      .select("schemaname, tablename")
      .eq("schemaname", "public");

    if (tablesError) throw tablesError;

    console.log("\n=== TABLES ===");
    for (const table of tables || []) {
      console.log(`\n-- Table: ${table.tablename}`);

      // Get columns for each table
      const { data: columns, error: columnsError } = await supabase.rpc(
        "get_columns_info",
        { table_name: table.tablename }
      );

      if (columnsError) {
        console.error(
          `Error getting columns for ${table.tablename}:`,
          columnsError
        );
        continue;
      }

      console.log("Columns:");
      for (const column of columns || []) {
        console.log(`  - ${column.column_name} (${column.data_type})`);
      }

      // Get foreign keys
      const { data: foreignKeys, error: fkError } = await supabase.rpc(
        "get_foreign_keys",
        { table_name: table.tablename }
      );

      if (!fkError && foreignKeys && foreignKeys.length > 0) {
        console.log("Foreign Keys:");
        for (const fk of foreignKeys) {
          console.log(
            `  - ${fk.column_name} -> ${fk.foreign_table}.${fk.foreign_column}`
          );
        }
      }
    }

    console.log("\nSchema export complete!");
  } catch (error) {
    console.error("Error exporting schema:", error);
  }
}

// Execute the function
exportSchema();
