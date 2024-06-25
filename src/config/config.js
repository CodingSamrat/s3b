
import fs from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'


// Load the configuration file
async function loadConfig() {
    // const configPath = path.resolve(__dirname, 's3b.config.js');
    const configPath = 's3b.config.js'

    if (!fs.existsSync(configPath)) {
        console.error('Configuration file not found');
        process.exit(1);
    }

    try {
        const config = (await import(pathToFileURL(configPath))).config;
        return config;
    } catch (error) {
        console.error('Error reading configuration file:', error);
        process.exit(1);
    }
}

export default (await loadConfig());
