export class UnauthorizedError extends Error {
  constructor(
    detail: string,
    public readonly field: string,
  ) {
    super(detail);
  }
}
