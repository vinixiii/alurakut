import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../../src/lib/AlurakutCommons';

import MainGrid from '../../src/components/MainGrid/index';
import Box from '../../src/components/Box/index';
import Scrap from '../../src/components/Scrap';

export default function Scrapbook() {
  const router = useRouter();
  const { user } = router.query;

  const githubUser = user;
  const [userName, setUserName] = useState('');

  const [username, setUsername] = useState('');
  const [description, setDescription] = useState('');
  const [scraps, setScraps] = useState([]);

  function getGithubName() {
    fetch(`https://api.github.com/users/${githubUser}`)
      .then((res) => res.json())
      .then((data) => setUserName(data.name))
      .catch((error) => console.log(error));
  }

  function getDataFromDato() {
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
    getGithubName();
    getDataFromDato();
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
            <form onSubmit={(e) => handleCreateScrap(e)}>
              <div>
                <input
                  placeholder="Digite seu username do GitHub"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  aria-label="Digite seu username do GitHub"
                  type="text"
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <textarea
                  placeholder="Deixe um recado para este usuário"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-label="Deixe um recado para vinixiii"
                  type="text"
                  autoComplete="off"
                  required
                />
              </div>

              <button>Enviar recado</button>
            </form>
          </Box>

          <Box>
            <h1 className="subTitle">
              Página de recados de {userName === null ? githubUser : userName} (
              {scraps.length})
            </h1>
            <p className="pathSubtitle">
              Início &#62; {githubUser} <span>&#62; Recados</span>
            </p>
            <hr />
            {scraps.length < 1 ? (
              <span className="noScrap">
                Este usuário ainda não possui recados
              </span>
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
