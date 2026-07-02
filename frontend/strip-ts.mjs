import { glob } from 'glob';
import { execSync } from 'child_process';
import fs from 'fs';

async function run() {
  const files = await glob('src/**/*.{ts,tsx}');
  console.log(`Found ${files.length} files to convert.`);

  for (const file of files) {
    try {
      console.log(`Detyping ${file}...`);
      execSync(`npx -y detype "${file}"`, { stdio: 'inherit' });
      
      const outExt = file.endsWith('.tsx') ? '.jsx' : '.js';
      const outPath = file.replace(/\.tsx?$/, outExt);
      
      // detype creates .js or .jsx if output is not specified, but let's check how it works
      // Actually, detype by default outputs to stdout unless -m is used, or maybe it generates a new file.
      // Let's use `detype "filename" "outname"`
      execSync(`npx -y detype "${file}" "${outPath}"`, { stdio: 'inherit' });
      fs.unlinkSync(file);
      console.log(`Done ${outPath}`);
    } catch (e) {
      console.error(`Failed on ${file}`);
    }
  }
}

run().catch(console.error);
