import { ApolloServer, gql } from "apollo-server";

// Fake Database

let tweets = [
  {
    id: "1",
    text: "first one",
  },
  {
    id: "2",
    text: "second one",
  },
];

const typeDefs = gql`
  type User {
    id: ID
    name: String
  }

  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
  }

  type Mutation {
    postTweet(text: String!, userId: ID!): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },
    tweet(_: any, { id }: any): { id: string; text: string } | undefined {
      return tweets.find((tweet) => tweet.id === id);
    },
  },

  Mutation: {
    postTweet(
      _: any,
      { text, userId }: any
    ): { id: string; text: string; userId: string } {
      const newTweet = {
        id: String(tweets.length + 1),
        text,
        userId,
      };

      tweets.push(newTweet);
      return newTweet;
    },

    deleteTweet(_: any, { id }: any): boolean {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;

      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server is running on ${url}`);
});
