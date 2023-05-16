export abstract class HTTPClient {
  public abstract invoke<T>(method: string, url: string, headers: any, data?: any): Promise<T>;
}
