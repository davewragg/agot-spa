import { EnvConfig } from './env-config.interface';

const ProdConfig: EnvConfig = {
  ENV: 'PROD',
  API: '<%= APP_BASE %>'
};

export = ProdConfig;

