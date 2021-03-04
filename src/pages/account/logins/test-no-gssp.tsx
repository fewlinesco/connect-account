import React from "react";

import { Container } from "@src/components/containers/container";
import { Layout } from "@src/components/page-layout";
import { LoginsOverviewTest } from "@src/components/pages/logins-overview/logins-overview-test";

const TestSoGSSPPage: React.FC<{
  alertMessages?: string[];
}> = ({ alertMessages }) => {
  return (
    <Layout
      alertMessages={alertMessages}
      title="Logins"
      breadcrumbs={["Your emails, phones and social logins"]}
    >
      <Container>
        <LoginsOverviewTest />
      </Container>
    </Layout>
  );
};

export default TestSoGSSPPage;
