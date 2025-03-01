import React from "react";
import { graphql } from "gatsby";

import ContestList from "../components/ContestList";
import DefaultLayout from "../templates/DefaultLayout";
import Definitions from "../components/content/Definitions";

export default function Contests({ data }) {
  const contests = data.contests.edges;

  return (
    <DefaultLayout pageTitle="Cosmos" bodyClass="cosmos">
      <section className="cosmos-hero">
        <img
          src="/images/cosmos-logo.svg"
          className="cosmos-logo"
          alt="Cosmos"
        />
        <p>&mdash; on &mdash;</p>
        <img src="/images/c4-logo.svg" className="c4-logo" alt="Code Arena" />
      </section>
      <section className="cosmos-wrapper">
        <h1>Audit contests for the Cosmos ecosystem</h1>
        <p>
          Code4rena contests incentivize finding as many rare and high risk
          vulnerabilities as possible in a short, focused window.
        </p>
        <Definitions />
      </section>
      {contests.length > 0 ? (
        <>
          <hr />
          <section className="cosmos-wrapper">
            <h2>Cosmos contests</h2>
            <section>
              <ContestList contests={contests} />
            </section>
          </section>
        </>
      ) : null}
      <section className="cosmos-bkg">
        <div className="cosmos-wrapper">
          <h2>Want to sponsor an audit contest for your project?</h2>
          <p>
            We’re booking new Cosmos contests now.{" "}
            <a href="https://discord.gg/code4rena">Join our Discord</a> and say,
            “I want to be a sponsor.”
          </p>
          <a className="button cta-button" href="https://docs.code4rena.com">
            Read how C4 works »
          </a>
        </div>
      </section>
    </DefaultLayout>
  );
}

export const query = graphql`
  query {
    contests: allContestsCsv(
      filter: { hide: { ne: true }, league: { eq: "cosmos" } }
      sort: { fields: start_time, order: DESC }
    ) {
      edges {
        node {
          id
          title
          details
          hide
          league
          start_time
          end_time
          amount
          repo
          sponsor {
            name
            image {
              childImageSharp {
                resize(width: 160) {
                  src
                }
              }
            }
            link
          }
          fields {
            submissionPath
            contestPath
            artPath
          }
        }
      }
    }
  }
`;
