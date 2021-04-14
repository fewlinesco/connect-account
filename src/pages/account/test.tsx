import {
  loggingMiddleware,
  tracingMiddleware,
  errorMiddleware,
  recoveryMiddleware,
  rateLimitingMiddleware,
} from "@fwl/web/dist/middlewares";
import { getServerSidePropsWithMiddlewares } from "@fwl/web/dist/next";
import type { GetServerSideProps } from "next";
import React from "react";
// import useSWR from "swr";

import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { logger } from "@src/configs/logger";
import getTracer from "@src/configs/tracer";
// import { SWRError } from "@src/errors/errors";
import { authMiddleware } from "@src/middlewares/auth-middleware";
import { sentryMiddleware } from "@src/middlewares/sentry-middleware";

const TestPage: React.FC = () => {
  //   const { data, error } = useSWR<Record<string, string>, SWRError>(
  //     "https://api.chucknorris.io/jokes/random",
  //   );

  //   if (error) {
  //     throw error;
  //   }

  const [joke, setJoke] = React.useState();

  React.useEffect(() => {
    async function getJoke(): Promise<void> {
      const result = await fetch("https://api.chucknorris.io/jokes/random")
        .then((data) => {
          console.log(data);
          return data.json();
        })
        .catch((error) => console.log(error));

      console.log(result);

      setJoke(result);
    }

    getJoke();
  }, []);

  return (
    <Layout breadcrumbs={false} title="Test">
      <Container>
        {typeof joke !== "undefined" ? <h1>{joke.value}</h1> : <h1>Nope</h1>}
      </Container>
    </Layout>
  );
};

const getServerSideProps: GetServerSideProps = async (context) => {
  return getServerSidePropsWithMiddlewares<{ joke: string }>(
    context,
    [
      tracingMiddleware(getTracer()),
      rateLimitingMiddleware(getTracer(), logger, {
        windowMs: 300000,
        requestsUntilBlock: 200,
      }),
      recoveryMiddleware(getTracer()),
      sentryMiddleware(getTracer()),
      errorMiddleware(getTracer()),
      loggingMiddleware(getTracer(), logger),
      authMiddleware(getTracer()),
    ],
    "/account/test",
    // async () => {
    //   const res = await fetch("https://api.chucknorris.io/jokes/random");
    //   const data = await res.json();

    //   if (!data) {
    //     return {
    //       notFound: true,
    //     };
    //   }

    //   return {
    //     props: { joke: data.value },
    //   };
    // },
  );
};

export { getServerSideProps };
export default TestPage;
