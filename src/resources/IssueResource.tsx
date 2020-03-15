import React from 'react';
import { FetchOptions } from 'rest-hooks';
import { Icon } from 'antd';
import BaseResource from './BaseResource';
import UserResource from './UserResource';

const stateToIcon: Record<string, JSX.Element> = {
  closed: <Icon type="issues-close" />,
  open: <Icon type="info-circle" />,
};

export default class IssueResource extends BaseResource {
  readonly id: number | undefined = undefined;
  //readonly url: string = '';
  readonly number: number = 0;
  readonly repositoryUrl: string = '';
  readonly htmlUrl: string = '';
  readonly body: string = '';
  readonly title: string = '';
  readonly user: string = '';
  readonly state: 'open' | 'closed' = 'open';
  readonly locked: boolean = false;
  readonly comments: number = 0;
  readonly createdAt: string = '1900-01-01T01:01:01Z';
  readonly updatedAt: string = '1900-01-01T01:01:01Z';
  readonly closedAt: string | null = null;

  get stateIcon() {
    return stateToIcon[this.state];
  }

  pk() {
    return [this.repositoryUrl, this.number].join(',');
  }
  static urlRoot = 'https://api.github.com/repos/issues';

  static getFetchOptions(): FetchOptions {
    return {
      pollFrequency: 60000,
    };
  }

  static url(urlParams: Readonly<any>): string {
    if (urlParams) {
      return `${urlParams.repositoryUrl}/issues/${urlParams.number}`;
    }
    return this.urlRoot;
  }

  static listUrl(
    searchParams: Readonly<Record<string, string | number>>,
  ): string {
    const queryParams: any = {
      ...searchParams,
      per_page: 50,
    };
    delete queryParams.repositoryUrl;

    const params = new URLSearchParams(queryParams);
    params.sort();
    return `${searchParams.repositoryUrl}/issues?${params.toString()}`;
  }

  static schema = {
    user: UserResource.asSchema(),
  };
}
//Pick<AbstractInstanceType<T>, 'repositoryUrl' | 'number'>
//Pick<AbstractInstanceType<T>, 'repositoryUrl'>
