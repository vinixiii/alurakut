import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
} from '../../src/lib/AlurakutCommons';

import MainGrid from '../../src/components/MainGrid/index';
import Box from '../../src/components/Box/index';
import Scrap from '../../src/components/Scrap';

export default function Scrapbook() {
  const githubUser = 'vinixiii';
  const [userName, setUserName] = useState('');

  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [communities, setCommunities] = useState([]);

  function getCommunitiesFromDato() {
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'a4f7abf1a97be84d00efed71df0b1c',
      },
      body: JSON.stringify({
        query: `query {
          allCommunities {
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

  useEffect(() => {
    getCommunitiesFromDato();
  }, [githubUser]);

  function handleCreateScrap(e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const newScrap = {
      username: username,
      description: description,
    };

    fetch('/api/scraps', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newScrap),
    }).then(async (res) => {
      const data = await res.json();
      const scrapCreated = data.recordCreated;
      setScraps([...scraps, scrapCreated]);
      setUsername('');
      setDescription('');
    });
  }

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
            <h1 className="title subPageTitle">Comunidades</h1>
            <p className="pathSubtitle">
              Início &#62; <span>Comunidades</span>
            </p>
            <hr />
            {communities.length < 1 ? (
              <span className="noScrap">Não há comunidades criadas</span>
            ) : (
              <ul>
                {communities.map((community) => {
                  return (
                    <Scrap key={community.id}>
                      <Link href={`/communities/${community.id}`} passHref>
                        <a>
                          <img src={community.imageUrl} />
                        </a>
                      </Link>
                      <div>
                        <span>{community.title}</span>
                        <p>Criador: {community.creatorSlug}</p>
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
