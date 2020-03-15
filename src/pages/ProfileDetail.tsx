import React from "react";
import { useResource } from "rest-hooks";
import { Card, Avatar } from "antd";
import UserResource from "../resources/UserResource";
import Markdown from "react-markdown";

const { Meta } = Card;

export default function ProfileDetail() {
  const user = useResource(UserResource.currentShape(), {});
  return (
    <React.Fragment>
      <Card>
        <Meta
          avatar={<Avatar src={user.avatarUrl} />}
          title={user.name}
          description={<Markdown source={user.bio} />}
        />
      </Card>
    </React.Fragment>
  );
}
