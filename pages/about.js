import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import Head from "next/head";
import Footer from "../shared/footer";
import Nav from "../shared/nav";
import Content from "../shared/content";
import { FinisherHeader } from "../shared/HeaderBG";

import Airplane from "../shared/Icons/Airplane";
import Audit from "../shared/Icons/Audit";
import Language from "../shared/Icons/Language";
import Alert from "../shared/Icons/Alert";
import Users from "../shared/Icons/Users";
import VCS from "../shared/Icons/VCS";

export default function Home() {
  useEffect(() => {
    gradient(document.querySelector(".hero"));
  }, []);

  return (
    <>
      <Head>
        <title>Inngest: About Us</title>
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="Inngest" />
        <meta property="og:url" content="https://www.inngest.com" />
        <meta property="og:image" content="/logo.svg" />
        <meta
          property="og:description"
          content="All about the company that started the event-driven serverless movement"
        />
        <script src="/inngest-sdk.js"></script>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e2fa9f28c34844e4a0d29351b8730579"}'
        ></script>
      </Head>

      <Nav />

      <Hero className="hero">
        <Content className="grid">
          <div>
            <h1>About</h1>
            <p>
              We're creating a new way of deploying serverless functions for
              developers that's faster, more reliable, and easier to
              grow&nbsp;and&nbsp;scale.
            </p>
          </div>
        </Content>
      </Hero>

      <Content></Content>

      <div style={{ marginTop: 100 }}>
        <Footer />
      </div>
    </>
  );
}

const gradient = (el, colors = ["#18435c", "#18435c", "#2f622f"]) => {
  new FinisherHeader(
    {
      count: 6,
      size: {
        min: 1000,
        max: 1800,
        pulse: 0,
      },
      speed: {
        x: {
          min: 0.1,
          max: 1.1,
        },
        y: {
          min: 0.1,
          max: 1,
        },
      },
      colors: {
        background: "#0f111e",
        particles: colors,
      },
      blending: "lighten",
      opacity: {
        center: 0.5,
        edge: 0,
      },
      shapes: ["c"],
    },
    el
  );
};

const Hero = styled.div`
  position: relative;
  z-index: 2;
  overflow: hidden;

  .grid {
    position: relative;
    z-index: 2;
    text-align: center;

    > div:first-of-type {
      z-index: 2;
      padding: 13vh 0;
      max-width: 700px;
      margin: 0 auto;
    }
  }

  h1 + p {
    font-size: 22px;
    line-height: 1.45;
  }
`;
