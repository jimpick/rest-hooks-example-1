import BaseResource from "./BaseResource";

export default abstract class PreviewResource extends BaseResource {
  static fetchOptionsPlugin = (options: RequestInit) => ({
    ...options,
    headers: {
      ...options.headers,
      Accept: "application/vnd.github.squirrel-girl-preview+json"
    }
  });
}
