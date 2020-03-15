import React, { Suspense } from "react";
import { Route, Switch, RouteProps } from "react-router-dom";
import { NetworkErrorBoundary } from "rest-hooks";
import { Spin } from "antd";
import IssueList from "./pages/IssueList";
import IssueDetail from "./pages/IssueDetail";
import ProfileDetail from "./pages/ProfileDetail";

export default () => (
  <Suspense
    fallback={
      <div className="center">
        <Spin size="large" />
      </div>
    }
  >
    <NetworkErrorBoundary>
      <Switch>
        <Route
          exact
          path="/"
          component={({ location }: RouteProps) => {
            const page = Number.parseInt(
              new URLSearchParams(location && location.search.substring(1)).get(
                "page"
              ) || "1"
            );
            return (
              <IssueList
                repositoryUrl="https://api.github.com/repos/facebook/react"
                page={page}
              />
            );
          }}
        />
        <Route
          exact
          path="/closed"
          component={() => (
            <IssueList
              repositoryUrl="https://api.github.com/repos/facebook/react"
              state="closed"
            />
          )}
        />
        <Route
          exact
          path="/open"
          component={() => (
            <IssueList
              repositoryUrl="https://api.github.com/repos/facebook/react"
              state="open"
            />
          )}
        />
        <Route exact path="/issues" component={IssueList} />
        <Route path="/issue/:number" component={IssueDetail} />
        <Route exact path="/profile" component={ProfileDetail} />
      </Switch>
    </NetworkErrorBoundary>
  </Suspense>
);
