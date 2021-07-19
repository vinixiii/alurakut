import { useState, useEffect } from 'react';
import Link from 'next/link';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
} from '../../src/lib/AlurakutCommons';

import MainGrid from '../../src/components/MainGrid/index';
import Box from '../../src/components/Box/index';
import Scrap from '../../src/components/Scrap';
import { useCheckAuth } from '../../src/hooks/useCheckAuth';

export default function Scrapbook({ githubUser }) {
  const [followers, setFollowers] = useState([]);

  function getGithubFollowers() {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((res) => res.json())
      .then((data) => setFollowers(data))
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    getGithubFollowers();
  }, [githubUser]);

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
            <h1 className="title subPageTitle">Amigos</h1>
            <p className="pathSubtitle">
              Início &#62; {githubUser} &#62; <span>Amigos</span>
            </p>
            <hr />
            {followers.length < 1 ? (
              <span className="noScrap">Não há amigos</span>
            ) : (
              <ul>
                {followers.map((follower) => {
                  return (
                    <Scrap key={follower.id}>
                      <Link href={`/profile/${follower.login}`} passHref>
                        <a>
                          <img
                            src={`https://github.com/${follower.login}.png`}
                          />
                        </a>
                      </Link>
                      <div>
                        <span>{follower.login}</span>
                        <a
                          className="githubLink"
                          href={follower.html_url}
                          target="_blank"
                        >
                          <p>{follower.html_url}</p>
                        </a>
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

  const isAuthenticated = await useCheckAuth(userToken);

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
