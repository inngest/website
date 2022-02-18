import { useEffect, useState } from "react"
import styled from "@emotion/styled"
import Head from "next/head"
import Footer from "../shared/footer"
import Nav from "../shared/nav"
import Content from "../shared/content"
// import { FinisherHeader } from "../shared/HeaderBG"

import Block from "../shared/Block"

import Airplane from "../shared/Icons/Airplane"
import Audit from "../shared/Icons/Audit"
import Language from "../shared/Icons/Language"
import Alert from "../shared/Icons/Alert"
import Users from "../shared/Icons/Users"
import VCS from "../shared/Icons/VCS"

const MISSION = "Accelerate the adoption of event based architecture."
const VISION = "World class architecture accessible to everyone."

const TEAM = [
  {
    name: "Tony Holdstock-Brown",
    role: "CEO & Founder",
    bio: "Former Head of Engineering at Uniform Teeth",
    avatar: "/team/tony-2022-02-18.jpg",
  },
  {
    name: "Dan Ramich",
    role: "Founding Engineer",
    bio: "Former Staff Engineer at Rancher (SUSE)",
    avatar: "/team/dan-r-2022-02-18.jpg",
  },
  {
    name: "Dan Farrelly",
    role: "Foudning Engineer",
    bio: "Former CTO at Buffer",
    avatar: "/team/dan-f-2022-02-18.jpg",
  },
]

const INVESTORS = [
  {
    name: "Afore.vc",
  },
  {
    name: "Kleiner Perkins",
  },
  {
    name: "Banana Capital",
  },
]

export default function Home() {
  return (
    <Page>
      <Head>
        <title>Inngest: About Us</title>
        <link rel="icon" href="/favicon.png" />
        <meta property="og:title" content="Inngest" />
        <meta property="og:url" content="https://www.inngest.com" />
        <meta property="og:image" content="/logo.svg" />
        <meta property="og:description" content={MISSION} />
        <script src="/inngest-sdk.js"></script>
        <script
          defer
          src="https://static.cloudflareinsights.com/beacon.min.js"
          data-cf-beacon='{"token": "e2fa9f28c34844e4a0d29351b8730579"}'
        ></script>
      </Head>

      <Nav />

      <Hero className="hero">
        <Content>
          <Label>Our Mission</Label>
          <h1>{MISSION}</h1>
          <p>
            We're creating a new way of deploying serverless functions for
            developers that's faster, more reliable, and easier to
            grow&nbsp;and&nbsp;scale.
          </p>
        </Content>
      </Hero>

      <Content>
        <h2>Team</h2>
        <Grid>
          {TEAM.map((person) => {
            return (
              <Block>
                <Avatar src={person.avatar} />
                <h3>{person.name}</h3>
                <p>
                  <strong>{person.role}</strong> - {person.bio}
                </p>
              </Block>
            )
          })}
        </Grid>

        <h2>Investors</h2>
        <Grid>
          {INVESTORS.map((person) => {
            return (
              <Block>
                <h3>{person.name}</h3>
              </Block>
            )
          })}
        </Grid>
      </Content>

      <div style={{ marginTop: 100 }}>
        <Footer />
      </div>
    </Page>
  )
}

const Page = styled.div`
  background: url(/assets/hero-grid.svg) no-repeat right top;
`

const Avatar = styled.img`
  border-radius: 50%;
  width: 5rem;
  height: 5rem;
  margin-bottom: 1rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem 2rem;
  margin: 2rem 0;
`

const Label = styled.p`
  font-size: 0.7rem;
  text-transform: uppercase;
  margin: 0.5rem 0;
  font-family: var(--font-mono);
`

const Hero = styled.div`
  margin: 4rem 0;

  h1 {
    font-size: 2rem;
  }
  p {
    max-width: 36rem;
  }
`
