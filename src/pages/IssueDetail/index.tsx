import { useResource, useFetcher, useRetrieve } from 'rest-hooks';
import { Card, Avatar } from 'antd';
import { groupBy } from 'lodash';
import React, { Suspense, useMemo } from 'react';
import IssueResource from '../../resources/IssueResource';
import ReactionResource from '../../resources/ReactionResource';
import UserResource from '../../resources/UserResource';
import { RouteChildrenProps } from 'react-router';
import Markdown from 'react-markdown';
import CommentsList, { CardLoading } from './CommentsList';

const { Meta } = Card;

type Props = Pick<IssueResource, 'repositoryUrl'>;

function ReactionSpan({
  reactions,
  issue,
}: {
  reactions: ReactionResource[];
  issue: IssueResource;
}) {
  const create = useFetcher(ReactionResource.createShape());
  const handleClick = () => {
    create(
      { repositoryUrl: issue.repositoryUrl, number: issue.number },
      { content: reactions[0].content },
    );
  };
  return (
    <span>
      {reactions[0].contentIcon} {reactions.length}
    </span>
  );
}

export default function IssueDetail({
  match,
}: RouteChildrenProps<{ number: string }>) {
  let number = 1;
  if (match && match.params && match.params.number) {
    number = Number.parseInt(match.params.number, 10);
  }
  useRetrieve(ReactionResource.listShape(), {
    repositoryUrl: 'https://api.github.com/repos/facebook/react',
    number,
  });
  const [issue] = useResource([
    IssueResource.detailShape(),
    {
      repositoryUrl: 'https://api.github.com/repos/facebook/react',
      number,
    },
  ]);
  const user = useResource(UserResource.detailShape(), {
    login: issue.user,
  });
  const { results: reactions } = useResource(ReactionResource.listShape(), {
    repositoryUrl: 'https://api.github.com/repos/facebook/react',
    number,
  });

  const actions: JSX.Element[] = useMemo(() => {
    const grouped = groupBy(reactions, reaction => reaction.content);
    return Object.entries(grouped).map(([k, v]) => (
      <ReactionSpan reactions={v} issue={issue} />
    ));
  }, [reactions, issue]);

  return (
    <React.Fragment>
      <Card actions={actions}>
        <Meta
          avatar={<Avatar src={user && user.avatarUrl} />}
          title={issue.title}
          description={<Markdown source={issue.body} />}
        />
      </Card>
      {issue.comments ? (
        <Suspense fallback={<CardLoading />}>
          <CommentsList issueUrl={issue.url} />
        </Suspense>
      ) : null}
    </React.Fragment>
  );
}
