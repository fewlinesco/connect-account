import { GetServerSideProps } from "next";
import React from "react";

import { IdentityTypes } from "@lib/@types";
import {
  ChildrenContainer,
  DesktopNavigationBarWrapper,
  Flex,
  Main,
  MobileDisplayOnly,
} from "@src/components/Layout";
import { AddIdentity } from "@src/components/business/AddIdentity";
import { AddIdentityForm } from "@src/components/display/fewlines/AddIdentityForm/AddIdentityForm";
import { Container } from "@src/components/display/fewlines/Container";
import { DesktopNavigationBar } from "@src/components/display/fewlines/DesktopNavigationBar/DesktopNavigationBar";
import { H1 } from "@src/components/display/fewlines/H1/H1";
import { Header } from "@src/components/display/fewlines/Header/Header";
import { MobileNavigationBar } from "@src/components/display/fewlines/MobileNavigationBar/MobileNavigationBar";
import { NavigationBreadcrumbs } from "@src/components/display/fewlines/NavigationBreadcrumbs/NavigationBreadcrumbs";
import { withSSRLogger } from "@src/middlewares/withSSRLogger";
import withSession from "@src/middlewares/withSession";

const AddIdentityPage: React.FC<{ type: IdentityTypes }> = ({ type }) => {
  return (
    <Main>
      <MobileDisplayOnly>
        <Header />
        <MobileNavigationBar />
      </MobileDisplayOnly>
      <Flex>
        <DesktopNavigationBarWrapper>
          <DesktopNavigationBar />
        </DesktopNavigationBarWrapper>
        <ChildrenContainer>
          <Container>
            <H1>Logins</H1>
            <NavigationBreadcrumbs
              breadcrumbs={[
                type.toLocaleUpperCase() === IdentityTypes.EMAIL
                  ? "Email address"
                  : "Phone number",
                "new",
              ]}
            />
            <AddIdentity type={type}>
              {({ addIdentity }) => (
                <AddIdentityForm type={type} addIdentity={addIdentity} />
              )}
            </AddIdentity>
          </Container>
        </ChildrenContainer>
      </Flex>
    </Main>
  );
};

export default AddIdentityPage;

export const getServerSideProps: GetServerSideProps = withSSRLogger(
  withSession(async (context) => {
    return {
      props: {
        type: context.params.type,
      },
    };
  }),
);
