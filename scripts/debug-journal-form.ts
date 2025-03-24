import { writeFileSync } from "fs";
import * as path from "path";

/**
 * Creates a debug file that can help identify the error in the journal form
 */
function debugJournalForm() {
  const debugContent = `
// This file will help debug the journal entry form
// To use it, add the following code to your JournalEntryForm component:

// At the top of your component, add:
console.log('Strategy data received:', strategies);

// Before rendering the strategy dropdown, add:
console.log('About to render strategy dropdown, strategies is:', 
  strategies, 
  'isArray:', Array.isArray(strategies),
  'length:', strategies?.length
);

// When mapping over strategies, wrap in a try/catch:
try {
  {strategies && strategies.length > 0 ? (
    strategies.map((strategy) => (
      <SelectItem key={strategy.id} value={strategy.id}>
        {strategy.name}
      </SelectItem>
    ))
  ) : (
    <SelectItem value="none" disabled>
      No strategies available
    </SelectItem>
  )}
} catch (error) {
  console.error('Error rendering strategies:', error);
  return <SelectItem value="error">Error loading strategies</SelectItem>;
}
`;

  const outputPath = path.join(process.cwd(), "debug-notes.js");
  writeFileSync(outputPath, debugContent);
  console.log(`Debug notes written to ${outputPath}`);
}

debugJournalForm();
