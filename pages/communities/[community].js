import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  AlurakutMenu,
  AlurakutProfileSidebarMenuDefault,
} from '../../src/lib/AlurakutCommons';

import MainGrid from '../../src/components/MainGrid';
import Box from '../../src/components/Box';
import { ProfileRelationsBoxWrapper } from '../../src/components/ProfileRelations';
import InfoBox from '../../src/components/InfoBox';

import { useCheckAuth } from '../../src/hooks/useCheckAuth';

export default function Community({ githubUser }) {
  const router = useRouter();
  const { community } = router.query;
  const communityId = community;

  const [members, setMembers] = useState([]);
  const [isMember, setIsMember] = useState(false);
  const [communityInfo, setCommunityInfo] = useState({});
  const [isShowingMoreMembers, setIsShowingMoreMembers] = useState(false);

  async function getCommunityInfoFromDato() {
    const { data } = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'a4f7abf1a97be84d00efed71df0b1c',
      },
      body: JSON.stringify({
        query: `query {
          community(filter: {id: {eq: "${communityId}"}}) {
            title,
            imageUrl,
            creatorSlug,
            createdAt,
            users {
              id,
              username
            }
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .catch((err) => console.error(err));

    const findUser = data.community.users.find(
      (user) => user.username === githubUser
    );

    console.log(findUser);

    if (findUser) {
      setIsMember(true);
    }

    setCommunityInfo({
      title: data.community.title,
      imageUrl: data.community.imageUrl,
      creatorSlug: data.community.creatorSlug,
      createdAt: data.community.createdAt,
    });

    setMembers(data.community.users);
  }

  useEffect(() => {
    getCommunityInfoFromDato();
  }, []);

  async function handleJoinCommunity(e) {
    e.preventDefault();

    const githubUserId = await nookies.get().userId;

    const alreadyMember = members.filter((member) => member.id == githubUserId);

    if (alreadyMember < 1) {
      fetch('/api/updateCommunity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: githubUserId,
          communityId: communityId,
        }),
      })
        .then(async () => {
          await getCommunityInfoFromDato();

          toast.success('Agora você participa desta comunidade! 🎉', {
            position: 'bottom-right',
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        })
        .catch((err) => console.error(err));

      return;
    }

    toast.warn('Você já participa desta comunidade! 👀', {
      position: 'bottom-right',
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  function handleShowMoreMembers(e) {
    e.preventDefault();
    setIsShowingMoreMembers(!isShowingMoreMembers);
  }

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profile-area" style={{ gridArea: 'profile-area' }}>
          <Box as="aside">
            <img
              className="communityImg"
              src={communityInfo.imageUrl}
              style={{ borderRadius: '8px' }}
            />

            <hr />
            <p>
              <a className="boxLink community" href={`#`} target="_blank">
                {communityInfo.title}
              </a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault
              handleJoinCommunity={handleJoinCommunity}
              isCommunityInfo
              isMember={isMember}
            />
          </Box>
        </div>
        <div className="welcome-area" style={{ gridArea: 'welcome-area' }}>
          <Box>
            <h1 className="title subPageTitle">{communityInfo.title}</h1>
            <p className="pathSubtitle">
              Início &#62; Comunidades <span>&#62; {communityInfo.title}</span>
            </p>
            <hr />
            <InfoBox>
              <tbody>
                <tr>
                  <td className="textOnRight">dono:</td>
                  <td>{communityInfo.creatorSlug}</td>
                </tr>
                <tr>
                  <td className="textOnRight">criado em:</td>
                  <td>
                    {new Date(communityInfo.createdAt).toLocaleDateString()}
                  </td>
                </tr>
                <tr>
                  <td className="textOnRight">membros:</td>
                  <td>{members.length}</td>
                </tr>
              </tbody>
            </InfoBox>
          </Box>
        </div>
        <div
          className="profile-relation-area"
          style={{ gridArea: 'profile-relation-area' }}
        >
          <ProfileRelationsBoxWrapper isShowingMoreItems={isShowingMoreMembers}>
            <h2 className="smallTitle">Membros ({members.length})</h2>
            <ul>
              {members.map((item) => {
                return (
                  <li key={item.username}>
                    <Link href={`/profile/${item.username}`} passHref>
                      <a>
                        <img src={`https://github.com/${item.username}.png`} />
                        <span>{item.username}</span>
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
            {members.length > 6 && (
              <>
                <hr />
                <button
                  className="toggleButton"
                  onClick={(e) => handleShowMoreMembers(e)}
                >
                  {isShowingMoreMembers ? 'Ver menos' : 'Ver mais'}
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

  const { githubUser } = jwt.decode(userToken);

  return {
    props: {
      githubUser: githubUser,
    },
  };
}
