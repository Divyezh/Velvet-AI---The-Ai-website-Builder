const { Sandbox } = require('e2b');
const fs = require('fs');
const path = require('path');

function getEnvKey(keyName) {
  const envPath = './.env';
  try {
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8');
      const lines = content.split('\n');
      for (const line of lines) {
        const match = line.match(/^\s*([^=#]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          let value = match[2].trim();
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
          }
          if (key === keyName) {
            return value;
          }
        }
      }
    }
  } catch (e) {
    console.error('Error reading env file:', e);
  }
  return undefined;
}

const apiKey = getEnvKey('E2B_API_KEY');
if (apiKey) {
  process.env.E2B_API_KEY = apiKey;
  console.log('Using API key starting with:', apiKey.substring(0, 10));
} else {
  console.log('No API key found in .env');
}

async function test() {
  try {
    console.log('Attempting to create a sandbox...');
    const sbx = await Sandbox.create();
    console.log('Sandbox created successfully! ID:', sbx.sandboxId);
    await sbx.close();
  } catch (err) {
    console.error('Failed to create sandbox:', err);
  }
}

test();
