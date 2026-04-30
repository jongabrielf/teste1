import fs from 'fs';
import { execSync } from 'child_process';

fs.chmodSync('android/gradlew', 0o755);
console.log('Fixed permissions for android/gradlew');

try {
  const javaVersion = execSync('java -version 2>&1').toString();
  console.log('Java version:', javaVersion);
  const javaPath = execSync('which java').toString();
  console.log('Java path:', javaPath);
} catch (e) {
  console.log('Java not found in PATH');
}
