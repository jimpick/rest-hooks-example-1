import React from "react";
import { useCache, useResource } from "rest-hooks";
import { Card, Avatar } from "antd";
import UserResource from "../../resources/UserResource";
import CommentResource from "../../resources/CommentResource";
import Markdown from "react-markdown";
import moment from "moment";

const { Meta } = Card;

export default function CommentsList({ issueUrl }: { issueUrl: string }) {
  const { results: comments } = useResource(CommentResource.listShape(), {
    issueUrl
  });

  return (
    <React.Fragment>
      {comments.map(comment => (
        <CommentInline key={comment.pk()} comment={comment} />
      ))}
    </React.Fragment>
  );
}

function CommentInline({ comment }: { comment: CommentResource }) {
  const user = useCache(UserResource.detailShape(), { login: comment.user });
  if (!user) return null;
  return (
    <Card style={{ marginTop: 16 }}>
      <Meta
        avatar={<Avatar src={user.avatarUrl} />}
        title={
          <React.Fragment>
            <a href={user.htmlUrl} target="_blank">
              {comment.user}
            </a>{" "}
            commented on {moment(comment.createdAt).format("MMM Do YYYY")}
          </React.Fragment>
        }
        description={<Markdown source={comment.body} />}
      />
    </Card>
  );
}

export function CardLoading() {
  return <Card style={{ marginTop: 16 }} loading={true} />;
}
