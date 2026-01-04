/**
 * Trac Instance Configuration
 * Supports multiple WordPress Trac instances (Core, Meta, etc.)
 */

export interface TracInstanceConfig {
  baseUrl: string;
  instanceName: string;
  instanceType: 'core' | 'meta';
  displayName: string;
}

export interface Env {
  ENVIRONMENT?: string;
  TRAC_INSTANCE?: 'core' | 'meta';
  TRAC_BASE_URL?: string;
  CF_VERSION_METADATA?: {
    id: string;
    tag?: string;
    timestamp: string;
  };
}

const INSTANCE_CONFIGS: Record<'core' | 'meta', Omit<TracInstanceConfig, 'baseUrl'> & { defaultBaseUrl: string }> = {
  core: {
    defaultBaseUrl: 'https://core.trac.wordpress.org',
    instanceName: 'WordPress Core Trac',
    instanceType: 'core',
    displayName: 'WordPress Core',
  },
  meta: {
    defaultBaseUrl: 'https://meta.trac.wordpress.org',
    instanceName: 'WordPress Meta Trac',
    instanceType: 'meta',
    displayName: 'WordPress.org Infrastructure',
  },
};

export function getTracConfig(env: Env): TracInstanceConfig {
  const instanceType = env.TRAC_INSTANCE || 'core';
  const instanceConfig = INSTANCE_CONFIGS[instanceType] || INSTANCE_CONFIGS.core;

  return {
    baseUrl: env.TRAC_BASE_URL || instanceConfig.defaultBaseUrl,
    instanceName: instanceConfig.instanceName,
    instanceType: instanceConfig.instanceType,
    displayName: instanceConfig.displayName,
  };
}

/**
 * Build a full Trac URL from a path and optional query parameters
 */
export function buildTracUrl(config: TracInstanceConfig, path: string, params?: Record<string, string>): string {
  const url = new URL(path, config.baseUrl);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value);
    }
  }
  return url.toString();
}
