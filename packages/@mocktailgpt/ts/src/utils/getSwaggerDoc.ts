import fs from 'fs';
import path from 'path';
import yaml from 'yaml';

export type SwaggerDoc = {
  paths: Record<string, Record<string, { operationId?: string; [key: string]: unknown }>>;
  // Optionnel : tu ajoutes components, schemas, etc, si tu veux exploiter + que les paths
};

const swaggerFilePath = path.resolve(
  __dirname,
  process.env.SWAGGER_PATH || '../../swagger/swagger.yaml',
);

let swaggerCache: SwaggerDoc | null = null;

const loadSwagger = (): SwaggerDoc => {
  if (!swaggerCache) {
    try {
      const fileContent = fs.readFileSync(swaggerFilePath, 'utf8');
      swaggerCache = yaml.parse(fileContent) as SwaggerDoc;
    } catch (e) {
      throw new Error(`[Swagger Loader] File not found or corrupted: ${swaggerFilePath}\n${e}`);
    }
  }
  return swaggerCache;
};

export const getSwaggerDoc = (): SwaggerDoc => {
  if (!swaggerCache) loadSwagger();
  return swaggerCache!;
};

export const resetSwaggerCache = () => {
  swaggerCache = null;
};
