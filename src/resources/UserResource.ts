import { Resource } from "rest-hooks";
import BaseResource from "./BaseResource";

export default class UserResource extends BaseResource {
  readonly id: number | undefined = undefined;
  readonly htmlUrl: string = "";
  readonly login: string = "";
  readonly avatarUrl: string = "";
  readonly gravatarUrl: string = "";
  readonly type: "User" = "User";
  readonly siteAdmin: boolean = false;

  readonly name: string = "";
  readonly company: string = "";
  readonly blog: string = "";
  readonly location: string = "";
  readonly email: string = "";
  readonly hireable: boolean = false;
  readonly bio: string = "";
  readonly publicRepos: number = 0;
  readonly publicGists: number = 0;
  readonly followers: number = 0;
  readonly following: number = 0;
  readonly createdAt: string = "1900-01-01T01:01:01Z";
  readonly updatedAt: string = "1900-01-01T01:01:01Z";
  readonly privateGists: number = 0;
  readonly totalPrivateRepos: number = 0;
  readonly ownedPrivateRepos: number = 0;
  readonly collaborators: number = 0;

  pk() {
    return this.login;
  }
  static urlRoot = "https://api.github.com/users/";

  /** Retrieves current logged in user */
  static currentShape<T extends typeof Resource>(this: T) {
    return {
      type: "read" as "read",
      schema: this.getEntitySchema(),
      getFetchKey() {
        return "https://api.github.com/user/";
      },
      fetch: (params: Readonly<object>, body?: Readonly<object>) => {
        return this.fetch("get", "https://api.github.com/user/", body);
      }
    };
  }
}
