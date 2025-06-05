const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const execAsync = promisify(exec);

class DockerRunner {
    constructor() {
        this.containerId = null;
        this.tempDir = path.join(__dirname, '../temp');
    }

    async initialize() {
        try {
            // Build Docker image if not exists
            await execAsync('docker build -t algoj-compiler -f Dockerfile.compiler .');
        } catch (error) {
            console.error('Error building Docker image:', error);
            throw error;
        }
    }

    async createContainer() {
        try {
            const { stdout } = await execAsync(
                'docker run -d --network none --cpus=1 --memory=512m --rm algoj-compiler'
            );
            this.containerId = stdout.trim();
            return this.containerId;
        } catch (error) {
            console.error('Error creating container:', error);
            throw error;
        }
    }

    async runCode(code, language, input = '') {
        if (!this.containerId) {
            await this.createContainer();
        }

        const fileId = uuidv4();
        let sourceFile, outputFile, command;

        try {
            // Create source file
            switch (language) {
                case 'cpp':
                    sourceFile = `${fileId}.cpp`;
                    outputFile = `${fileId}.out`;
                    command = `g++ ${sourceFile} -o ${outputFile} && ./${outputFile}`;
                    break;
                case 'python':
                    sourceFile = `${fileId}.py`;
                    command = `python3 ${sourceFile}`;
                    break;
                case 'java':
                    sourceFile = `Main.java`;
                    command = `javac ${sourceFile} && java Main`;
                    break;
                default:
                    throw new Error('Unsupported language');
            }

            // Write code to file
            await fs.writeFile(path.join(this.tempDir, sourceFile), code);
            if (input) {
                await fs.writeFile(path.join(this.tempDir, `${fileId}.txt`), input);
            }

            // Copy file to container
            await execAsync(`docker cp ${path.join(this.tempDir, sourceFile)} ${this.containerId}:/code/`);
            if (input) {
                await execAsync(`docker cp ${path.join(this.tempDir, `${fileId}.txt`)} ${this.containerId}:/code/`);
            }

            // Run code with timeout
            const { stdout, stderr } = await execAsync(
                `docker exec ${this.containerId} timeout ${process.env.MAX_EXECUTION_TIME || 5} sh -c '${command} < ${fileId}.txt'`,
                { timeout: (parseInt(process.env.MAX_EXECUTION_TIME) || 5) * 1000 }
            );

            // Cleanup
            await this.cleanup(fileId);

            return {
                success: true,
                output: stdout,
                error: stderr
            };
        } catch (error) {
            await this.cleanup(fileId);
            
            if (error.killed || error.signal === 'SIGTERM') {
                return {
                    success: false,
                    error: 'Execution timed out'
                };
            }

            return {
                success: false,
                error: error.stderr || error.message
            };
        }
    }

    async cleanup(fileId) {
        try {
            // Remove files from container
            await execAsync(`docker exec ${this.containerId} rm -f /code/*`);
            
            // Remove local temp files
            const files = await fs.readdir(this.tempDir);
            for (const file of files) {
                if (file.startsWith(fileId)) {
                    await fs.unlink(path.join(this.tempDir, file));
                }
            }
        } catch (error) {
            console.error('Cleanup error:', error);
        }
    }

    async stopContainer() {
        if (this.containerId) {
            try {
                await execAsync(`docker stop ${this.containerId}`);
                this.containerId = null;
            } catch (error) {
                console.error('Error stopping container:', error);
            }
        }
    }
}

module.exports = new DockerRunner(); 