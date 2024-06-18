import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
});
