import { Button, Flex, Select, Stack } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/Layout";
import PostComponent from "../components/PostComponent";
import { usePostsQuery } from "../generated/graphql";
import { changeSort } from "../util/changeSort";
import { withApollo } from "../util/withApollo";

const Top = () => {
  let { data, error, loading, fetchMore, variables } = usePostsQuery({
    variables: {
      limit: 15,
      sort: "top",
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
  });

  if (!loading && !data) {
    return (
      <div>
        <div>you got query failed for some reason</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Layout>
      Sort by:
      <Select
        placeholder="Select option"
        w={100}
        onChange={(event) => changeSort(event)}
        value="top"
      >
        <option value="new">New</option>
        <option value="top">Top</option>
      </Select>
      {!data && loading ? (
        <div>loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.posts.posts.map((p) => (!p ? null : <PostComponent p={p} />))}
        </Stack>
      )}
      {data && data.posts.hasMore ? (
        <Flex>
          <Button
            onClick={() => {
              fetchMore({
                variables: {
                  limit: variables?.limit,
                  sort: "top",
                  offset: data!.posts.offset + 15,
                },
              });
            }}
            isLoading={loading}
            m="auto"
            my={8}
          >
            load more
          </Button>
        </Flex>
      ) : null}
    </Layout>
  );
};

export default withApollo({ ssr: true })(Top);