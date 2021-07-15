import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
  OrkutNostalgicIconSet,
} from '../../src/lib/AlurakutCommons';
import MainGrid from '../../src/components/MainGrid';
import Box from '../../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../../src/components/ProfileRelations';

export default function Profile() {
  const router = useRouter();
  const { user } = router.query;

  const githubUser = user;
  const [profileUserName, setProfileUserName] = useState('');
  const [isShowingMoreFollowers, setIsShowingMoreFollowers] = useState(false);
  const [isShowingMoreCommunities, setIsShowingMoreCommunities] =
    useState(false);

  const [followers, setFollowers] = useState([]);
  const communities = [];

  // const userRepositories = [
  //   {
  //     id: 1,
  //     name: 'Alurakut',
  //     description: 'Aplicação web criada durante a #ImersaoReact da Alura',
  //     created_at: '14/07/2021',
  //   },
  // ];

  function getGithubFollowers() {
    fetch(`https://api.github.com/users/${githubUser}/followers`)
      .then((res) => res.json())
      .then((data) => setFollowers(data))
      .catch((error) => console.error(error));
  }

  function getUserRepositories() {
    fetch(
      `http://api.github.com/users/${this.state.username}/repos?sort=created&per_page=10`
    )
      .then((response) => response.json())
      .then((data) => setUserRepositories(data))
      .catch((error) => console.error(error));
  }

  function getGithubName() {
    fetch(`https://api.github.com/users/${githubUser}`)
      .then((res) => res.json())
      .then((data) => setProfileUserName(data.name))
      .catch((error) => console.log(error));
  }

  useEffect(() => {
    getGithubFollowers();
    getGithubName();
  }, [user]);

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

            <AlurakutProfileSidebarMenuDefault />
          </Box>
        </div>
        <div className="welcome-area" style={{ gridArea: 'welcome-area' }}>
          <Box>
            <h1 className="title">
              {profileUserName === null ? githubUser : profileUserName}
            </h1>
            <OrkutNostalgicIconSet />
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
            <h2 className="smallTitle">Comunidades ({communities.length})</h2>
            <ul>
              {communities.map((item) => {
                return (
                  <li key={item.id}>
                    <a href={item.link} target="_blank">
                      <img src={item.image} />
                      <span>{item.title}</span>
                    </a>
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
