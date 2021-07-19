import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
} from '../../src/lib/AlurakutCommons';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import MainGrid from '../../src/components/MainGrid/index';
import Box from '../../src/components/Box/index';
import Scrap from '../../src/components/Scrap';
import { useCheckAuth } from '../../src/hooks/useCheckAuth';

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
      .catch((error) => console.error(error));
  }

  useEffect(() => {
    getGithubName();
  }, []);

  function handleCreateScrap(e) {
    e.preventDefault();
    toast.info('Funcionalidade em desenvolvimento! 👀', {
      position: 'bottom-right',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
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

            <AlurakutProfileSidebarMenuDefault
              githubUser={githubUser}
              isFriendInfo
            />
          </Box>
        </div>

        <div className="welcome-area" style={{ gridArea: 'welcome-area' }}>
          <Box>
            <form onSubmit={(e) => handleCreateScrap(e)}>
              <div>
                <textarea
                  placeholder="Deixe um recado para este usuário"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  aria-label="Deixe um recado para vinixiii"
                  type="text"
                  autoComplete="off"
                  // required
                />
              </div>

              <button>Enviar recado</button>
            </form>
          </Box>

          <Box>
            <h1 className="title subPageTitle">
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
      <ToastContainer newestOnTop />
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

  return {
    props: {},
  };
}
