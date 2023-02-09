import { apolloClient } from '../index';
import type {
  ChallengeRequest,
  SignedAuthChallenge} from '../graphql/generated';
import {
  AuthenticateDocument,
  ChallengeDocument,
} from '../graphql/generated';

export const generateChallenge = async (request: ChallengeRequest) => {
  const result = await apolloClient.query({
    query: ChallengeDocument,
    variables: {
      request,
    },
  });

  return result.data.challenge;
};

export const authenticate = async (request: SignedAuthChallenge) => {
  const result = await apolloClient.mutate({
    mutation: AuthenticateDocument,
    variables: {
      request,
    },
  });

  return result.data!.authenticate;
};
