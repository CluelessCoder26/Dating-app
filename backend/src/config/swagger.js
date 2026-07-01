import path from 'path';
import YAML from 'yamljs';

const yamlPath = path.join(process.cwd(), 'docs', 'api', 'openapi.yaml');
export const swaggerSpec = YAML.load(yamlPath);
