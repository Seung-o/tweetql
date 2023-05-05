import { ApolloServer, gql } from "apollo-server";

// Fake Database

let tweets = [
  {
    id: "1",
    text: "first one",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
  },
];

let users = [
  {
    id: "1",
    firstname: "ha",
    lastname: "seungo",
  },
  {
    id: "2",
    firstname: "elon",
    lastname: "musk",
  },
];

// Init Graphql

const typeDefs = gql`
  type User {
    id: ID
    firstname: String
    lastname: String
    """
    Sum of firstname and lastname as a string
    """
    fullName: String
  }
  """
  Tweet object represents a resource for a tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User
  }

  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet
    allUsers: [User!]!
  }

  type Mutation {
    """
    Create tweet and return tweet created
    """
    postTweet(text: String!, userId: ID!): Tweet
    """
    Deletes a Tweet if found, else returns false
    """
    deleteTweet(id: ID): Boolean
  }
`;

const resolvers = {
  Query: {
    allTweets() {
      return tweets;
    },

    tweet(
      _: unknown,
      { id }: unknown
    ): { id: string; text: string } | undefined {
      return tweets.find((tweet) => tweet.id === id);
    },

    allUsers() {
      return users;
    },
  },

  Mutation: {
    postTweet(
      _: unknown,
      { text, userId }: unknown
    ): { id: string; text: string; userId: string } {
      const newTweet = {
        id: String(tweets.length + 1),
        text,
        userId,
      };

      tweets.push(newTweet);
      return newTweet;
    },

    deleteTweet(_: unknown, { id }: unknown): boolean {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (!tweet) return false;

      tweets = tweets.filter((tweet) => tweet.id !== id);
      return true;
    },
  },

  User: {
    fullName({ firstname, lastname }: unknown) {
      return `${firstname} ${lastname}`;
    },
  },

  Tweet: {
    author({ userId }: any) {
      return users.find((user) => user.id === userId);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`Server is running on ${url}`);
});
