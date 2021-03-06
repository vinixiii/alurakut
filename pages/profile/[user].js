import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import nookies from 'nookies';
import { ToastContainer } from 'react-toastify';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../../src/lib/AlurakutCommons';

import MainGrid from '../../src/components/MainGrid';
import Box from '../../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../../src/components/ProfileRelations';
import InfoBox from '../../src/components/InfoBox';

import { useCheckAuth } from '../../src/hooks/useCheckAuth';
import { useCommunities } from '../../src/hooks/useCommunities';
import { useUserId } from '../../src/hooks/useUserId';

export default function Profile() {
  const router = useRouter();
  const { user } = router.query;
  const githubUser = user;

  const [userInfo, setUserInfo] = useState({});
  const [isShowingMoreFollowers, setIsShowingMoreFollowers] = useState(false);
  const [isShowingMoreCommunities, setIsShowingMoreCommunities] =
    useState(false);

  const [followers, setFollowers] = useState([]);
  const [communities, setCommunities] = useState([]);

  function getGithubUserInfo() {
    fetch(`https://api.github.com/users/${githubUser}`)
      .then((res) => res.json())
      .then((data) =>
        setUserInfo({
          name: data.name,
          bio: data.bio,
          location: data.location,
          createdAt: data.created_at,
        })
      )
      .catch((error) => console.error(error));
  }

  function getGithubFollowers() {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((res) => res.json())
      .then((data) => setFollowers(data))
      .catch((error) => console.error(error));
  }

  async function getUserCommunities() {
    //Checa se o usuário existe no DatoCMS
    const userId = await useUserId(githubUser);

    //Se exister, faz a requisição para trazer suas comunidades
    if (userId !== null) {
      const communitiesFromDato = await useCommunities(userId);
      setCommunities(communitiesFromDato);
    }
  }

  useEffect(() => {
    getGithubUserInfo();
    getGithubFollowers();
    getUserCommunities();
  }, [githubUser]);

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

            <AlurakutProfileSidebarMenuDefault
              githubUser={githubUser}
              isFriendInfo
            />
          </Box>
        </div>
        <div className="welcome-area" style={{ gridArea: 'welcome-area' }}>
          <Box>
            <h1 className="title subPageTitle">
              {userInfo.name === null ? githubUser : userInfo.name}
            </h1>
            <span className="bio">{userInfo.bio}</span>

            <OrkutNostalgicIconSet />

            <InfoBox>
              <tbody>
                <tr>
                  <td className="textOnRight">localização:</td>
                  <td>{userInfo.location}</td>
                </tr>
                <tr>
                  <td className="textOnRight">membro desde:</td>
                  <td>{new Date(userInfo.createdAt).toLocaleDateString()}</td>
                </tr>
              </tbody>
            </InfoBox>
          </Box>
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
