import React from 'react';
import { useResource, useCache, useSubscription } from 'rest-hooks';
import { Link } from 'react-router-dom';
import { List, Avatar } from 'antd';
import moment from 'moment';
import LinkPagination from '../navigation/LinkPagination';
import IssueResource from '../resources/IssueResource';
import UserResource from '../resources/UserResource';

type Props = Pick<IssueResource, 'repositoryUrl'> & {
  page?: number;
  state?: IssueResource['state'];
};

export default function IssueList(props: Props) {
  const { results: issues, link } = useResource(
    IssueResource.listShape(),
    props,
  );
  useSubscription(IssueResource.listShape(), props);
  return (
    <React.Fragment>
      <List
        itemLayout="horizontal"
        dataSource={issues}
        renderItem={issue => <IssueListItem key={issue.pk()} issue={issue} />}
      />
      <div className="center">
        <LinkPagination link={link} />
      </div>
    </React.Fragment>
  );
}

function IssueListItem({ issue }: { issue: IssueResource }) {
  const user = useCache(UserResource.detailShape(), { login: issue.user });
  if (!user) return null;
  const actions = [];
  if (issue.comments) {
    actions.push(<Link to={`/issue/${issue.number}`}>🗨️{issue.comments}</Link>);
  }
  return (
    <List.Item actions={actions}>
      <List.Item.Meta
        avatar={<Avatar src={user && user.avatarUrl} />}
        title={
          <Link to={`/issue/${issue.number}`}>
            {issue.stateIcon} {issue.title}
          </Link>
        }
        description={
          <React.Fragment>
            <a href={issue.htmlUrl} target="_blank">
              #{issue.number}
            </a>{' '}
            opened {moment(issue.createdAt).fromNow()} by{' '}
            <a href={user.htmlUrl} target="_blank">
              {issue.user}
            </a>
          </React.Fragment>
        }
      />
    </List.Item>
  );
}
