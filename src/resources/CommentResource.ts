import { Resource } from 'rest-hooks';
import BaseResource from './BaseResource';
import UserResource from './UserResource';

export default class CommentResource extends BaseResource {
  readonly id: number | undefined = undefined;
  readonly issueUrl: string = '';
  readonly htmlUrl: string = '';
  readonly body: string = '';
  readonly user: string = '';
  readonly createdAt: string = '1900-01-01T01:01:01Z';
  readonly updatedAt: string = '1900-01-01T01:01:01Z';

  pk() {
    return this.id?.toString();
  }
  static urlRoot = 'https://api.github.com/repos/issues/comments';

  static url<T extends typeof Resource>(
    this: T,
    urlParams?: Readonly<any>,
  ): string {
    throw new Error('retrieving single comment not supported');
  }

  static listUrl<T extends typeof Resource>(
    this: T,
    searchParams?: Readonly<any>,
  ): string {
    if (!searchParams) throw new Error('requires searchparams');
    return `${searchParams.issueUrl}/comments`;
  }

  static schema = {
    user: UserResource.asSchema(),
  };
}
