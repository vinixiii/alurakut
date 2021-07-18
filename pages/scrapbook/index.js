import { useState, useEffect } from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
} from '../../src/lib/AlurakutCommons';

import MainGrid from '../../src/components/MainGrid/index';
import Box from '../../src/components/Box/index';
import Scrap from '../../src/components/Scrap';

export default function Scrapbook({ githubUser }) {
  const [scraps, setScraps] = useState([]);

  function getScrapsFromDato() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'a4f7abf1a97be84d00efed71df0b1c',
      },
      body: JSON.stringify({
        query: `query {
          allScraps(orderBy: createdAt_DESC) {
            id,
            username,
            description,
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((dataFromDato) => {
        const scrapsFromDato = dataFromDato.data.allScraps;
        setScraps(scrapsFromDato);
      });
  }

  useEffect(() => {
    getScrapsFromDato();
  }, []);

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid grid={2}>
        <div className="profile-area" style={{ gridArea: 'profile-area' }}>
          <Box as="aside">
            <img
              src={`https://github.com/${githubUser}.png`}
              style={{ borderRadius: '8px' }}
            />

            <hr />

            <p>
              <a
                className="boxLink"
                href={`https://github.com/${githubUser}`}
                target="_blank"
              >
                @{githubUser}
              </a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault githubUser={githubUser} />
          </Box>
        </div>

        <div className="welcome-area" style={{ gridArea: 'welcome-area' }}>
          <Box>
            <h1 className="title subPageTitle">Recados ({scraps.length})</h1>
            <p className="pathSubtitle">
              Início &#62; <span>Recados</span>
            </p>
            <hr />
            {scraps.length < 1 ? (
              <span className="noScrap">Ainda não há recados</span>
            ) : (
              <ul>
                {scraps.map((scrap) => {
                  return (
                    <Scrap key={scrap.id}>
                      <a>
                        <img src={`https://github.com/${scrap.username}.png`} />
                      </a>
                      <div>
                        <span>{scrap.username}</span>
                        <p>{scrap.description}</p>
                      </div>
                    </Scrap>
                  );
                })}
              </ul>
            )}
          </Box>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const userToken = await nookies.get(context).token;

  const { isAuthenticated } = await fetch(
    'https://alurakut-vinixiii.vercel.app/api/auth',
    {
      headers: {
        Authorization: userToken,
      },
    }
  ).then((res) => res.json());

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanet: false,
      },
    };
  }

  const { githubUser } = jwt.decode(userToken);

  return {
    props: {
      githubUser: githubUser,
    },
  };
}
