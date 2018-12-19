import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch } from "react-router-dom";
import Home from "../Home/Home";
import Portfolio from "../Portfolio/Portfolio";
import Admin from "../Admin/Admin";
import { FETCH_PAGE_NAVIGATIONS } from "../../graphql/navigation";
import { graphql, compose } from "react-apollo";
import withLoading from "../../hoc/withLoading";
import StaticPage from "../StaticPage/StaticPage";

const Blog = () => <div>Blog</div>;

const styles = theme => ({
  root: {
    width: theme.desktopWidth,
    margin: "0 auto",
    padding: "2rem",
    flex: "1"
  }
});

const Content = props => {
  const { staticPages } = props;
  return (
    <div className={props.classes.root}>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/portfolio" component={Portfolio} />
        <Route path="/admin" component={Admin} />
        {staticPages.map(page => (
          <Route
            path={"/" + page.perma}
            render={props => <StaticPage {...props} id={page.id} />}
            key={page.id}
          />
        ))}
      </Switch>
    </div>
  );
};

export default compose(
  withStyles(styles),
  graphql(FETCH_PAGE_NAVIGATIONS, {
    props: ({ data }) => {
      let navigations = data.navigations || [];
      return {
        staticPages: navigations.map(navigation => navigation.page),
        isLoading: data.loading
      };
    }
  }),
  withLoading
)(Content);
