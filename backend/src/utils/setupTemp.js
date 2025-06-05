const fs = require('fs').promises;
const path = require('path');

async function setupTempDirectory() {
    const tempDir = path.join(__dirname, '../temp');
    
    try {
        // Check if directory exists
        try {
            await fs.access(tempDir);
        } catch {
            // Create directory if it doesn't exist
            await fs.mkdir(tempDir, { recursive: true });
        }

        // Set proper permissions (readable/writable by the application)
        await fs.chmod(tempDir, 0o755);

        console.log('Temporary directory setup completed');
    } catch (error) {
        console.error('Error setting up temporary directory:', error);
        throw error;
    }
}

module.exports = setupTempDirectory; 