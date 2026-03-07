export class RepositoryNotFoundError extends Error {
  constructor(
    detail: string,
    public readonly field: string,
  ) {
    super(detail);
  }
}
