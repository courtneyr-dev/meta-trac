import { describe, it, expect } from 'vitest';
import { getTracConfig, buildTracUrl, type Env } from '../src/config';

describe('getTracConfig', () => {
  it('returns core config by default', () => {
    const env: Env = {};
    const config = getTracConfig(env);

    expect(config.instanceType).toBe('core');
    expect(config.baseUrl).toBe('https://core.trac.wordpress.org');
    expect(config.instanceName).toBe('WordPress Core Trac');
    expect(config.displayName).toBe('WordPress Core');
  });

  it('returns meta config when TRAC_INSTANCE is meta', () => {
    const env: Env = { TRAC_INSTANCE: 'meta' };
    const config = getTracConfig(env);

    expect(config.instanceType).toBe('meta');
    expect(config.baseUrl).toBe('https://meta.trac.wordpress.org');
    expect(config.instanceName).toBe('WordPress Meta Trac');
    expect(config.displayName).toBe('WordPress.org Infrastructure');
  });

  it('allows TRAC_BASE_URL override', () => {
    const env: Env = {
      TRAC_INSTANCE: 'meta',
      TRAC_BASE_URL: 'https://custom.trac.example.org',
    };
    const config = getTracConfig(env);

    expect(config.baseUrl).toBe('https://custom.trac.example.org');
    expect(config.instanceType).toBe('meta');
  });
});

describe('buildTracUrl', () => {
  it('builds URL with path', () => {
    const config = getTracConfig({ TRAC_INSTANCE: 'core' });
    const url = buildTracUrl(config, '/query');

    expect(url).toBe('https://core.trac.wordpress.org/query');
  });

  it('builds URL with query params', () => {
    const config = getTracConfig({ TRAC_INSTANCE: 'meta' });
    const url = buildTracUrl(config, '/query', { format: 'csv', max: '10' });

    expect(url).toContain('https://meta.trac.wordpress.org/query');
    expect(url).toContain('format=csv');
    expect(url).toContain('max=10');
  });
});

describe('URL building for different instances', () => {
  it('builds correct ticket URL for core', () => {
    const config = getTracConfig({ TRAC_INSTANCE: 'core' });
    const ticketUrl = `${config.baseUrl}/ticket/12345`;

    expect(ticketUrl).toBe('https://core.trac.wordpress.org/ticket/12345');
  });

  it('builds correct ticket URL for meta', () => {
    const config = getTracConfig({ TRAC_INSTANCE: 'meta' });
    const ticketUrl = `${config.baseUrl}/ticket/100`;

    expect(ticketUrl).toBe('https://meta.trac.wordpress.org/ticket/100');
  });

  it('builds correct changeset URL for meta', () => {
    const config = getTracConfig({ TRAC_INSTANCE: 'meta' });
    const changesetUrl = `${config.baseUrl}/changeset/1`;

    expect(changesetUrl).toBe('https://meta.trac.wordpress.org/changeset/1');
  });

  it('builds correct timeline URL for meta', () => {
    const config = getTracConfig({ TRAC_INSTANCE: 'meta' });
    const timelineUrl = `${config.baseUrl}/timeline?format=rss`;

    expect(timelineUrl).toBe('https://meta.trac.wordpress.org/timeline?format=rss');
  });
});
