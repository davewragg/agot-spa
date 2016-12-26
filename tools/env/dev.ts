import { EnvConfig } from './env-config.interface';

const DevConfig: EnvConfig = {
  ENV: 'DEV',
  API: '//paulhoughton.org<%= APP_BASE %>',
};

export = DevConfig;

