import { useState, useEffect } from 'react';
import Link from 'next/link';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons';

import MainGrid from '../src/components/MainGrid/index';
import Box from '../src/components/Box/index';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';
import Scrap from '../src/components/Scrap';

export default function Home({ githubUser }) {
  const [githubUserId, setGithubUserId] = useState('');

  const [isShowingMoreFollowers, setIsShowingMoreFollowers] = useState(false);
  const [isShowingMoreCommunities, setIsShowingMoreCommunities] =
    useState(false);

  const [followers, setFollowers] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [scraps, setScraps] = useState([]);

  function getGithubFollowers() {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((res) => res.json())
      .then((data) => setFollowers(data))
      .catch((error) => console.log(error));
  }

  function getMyUserInfoFromDato() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'a4f7abf1a97be84d00efed71df0b1c',
      },
      body: JSON.stringify({
        query: `query {
          user(filter: {username: {eq: "${githubUser}"}}) {
            id
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then(async (dataFromDato) => {
        const userId = await dataFromDato.data.user.id;
        getMyCommunitiesFromDato(userId);
        setGithubUserId(userId);

        nookies.set(null, 'userId', userId, {
          path: '/',
          maxAge: 86400 * 7,
        });
      });
  }

  function getMyCommunitiesFromDato(userId) {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'a4f7abf1a97be84d00efed71df0b1c',
      },
      body: JSON.stringify({
        query: `query {
          allCommunities(filter: { users: { allIn: ["${userId}"] } }) {
            id,
            title,
            imageUrl,
            link,
            creatorSlug
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((dataFromDato) => {
        const communitiesFromDato = dataFromDato.data.allCommunities;
        setCommunities(communitiesFromDato);
      });
  }

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
          allScraps {
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
    getGithubFollowers();
    getMyUserInfoFromDato();
    getScrapsFromDato();
  }, []);

  function handleCreateCommunity(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const community = {
      title: formData.get('title'),
      imageUrl: formData.get('image'),
      link: formData.get('link'),
      creatorSlug: githubUser,
      users: [`${githubUserId}`],
    };

    fetch('/api/communities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(community),
    }).then(async (res) => {
      const data = await res.json();
      const communityCreated = data.recordCreated;
      setCommunities([...communities, communityCreated]);
    });
  }

  function handleShowMoreFollowers(e) {
    e.preventDefault();
    setIsShowingMoreFollowers(!isShowingMoreFollowers);
  }

  function handleShowMoreCommunities(e) {
    e.preventDefault();
    setIsShowingMoreCommunities(!isShowingMoreCommunities);
  }

  return (
    <>
      <AlurakutMenu githubUser={githubUser} />
      <MainGrid>
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
            <h1 className="title">Bem-vindo(a)</h1>
            <OrkutNostalgicIconSet
              recados={scraps.length}
              confiavel={3}
              legal={3}
              sexy={2}
            />
          </Box>

          <Box>
            <h2 className="subTitle">O que você deseja fazer?</h2>
            <form onSubmit={(e) => handleCreateCommunity(e)}>
              <div>
                <input
                  placeholder="Digite um nome para sua comunidade"
                  name="title"
                  aria-label="Digite um nome para sua comunidade"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Insira uma URL para usar como imagem de capa"
                  name="image"
                  aria-label="Insira uma URL para usar como imagem de capa"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Insira um link para sua comunidade"
                  name="link"
                  aria-label="Insira um link para sua comunidade"
                  type="text"
                />
              </div>

              <button>Criar comunidade</button>
            </form>
          </Box>
          {scraps.length > 0 && (
            <Box>
              <h1 className="subTitle">Recados recentes</h1>
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
            </Box>
          )}
        </div>
        <div
          className="profile-relation-area"
          style={{ gridArea: 'profile-relation-area' }}
        >
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreFollowers}
          >
            <h2 className="smallTitle">Amigos ({followers.length})</h2>
            <ul>
              {followers.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/profile/${item.login}`} passHref>
                      <a>
                        <img src={`https://github.com/${item.login}.png`} />
                        <span>{item.login}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {followers.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => handleShowMoreFollowers(e)}
                >
                  {isShowingMoreFollowers ? 'Ver menos' : 'Ver mais'}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper
            isShowingMoreItems={isShowingMoreCommunities}
          >
            <h2 className="smallTitle">
              Minhas comunidades ({communities.length})
            </h2>
            <ul>
              {communities.map((item) => {
                return (
                  <li key={item.id}>
                    <Link href={`/communities/${item.id}`} passHref>
                      <a>
                        <img src={item.imageUrl} />
                        <span>{item.title}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {communities.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => handleShowMoreCommunities(e)}
                >
                  {isShowingMoreCommunities ? 'Ver menos' : 'Ver mais'}
                </button>
              </>
            )}
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}

export async function getServerSideProps(context) {
  const userToken = await nookies.get(context).token;

  const { isAuthenticated } = await fetch('http://localhost:3000/api/auth', {
    headers: {
      Authorization: userToken,
    },
  }).then((res) => res.json());

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
