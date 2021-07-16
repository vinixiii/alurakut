import React, { useState, useEffect } from 'react';
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
import InfoBox from '../../src/components/InfoBox';

export default function Community() {
  const router = useRouter();
  const { community } = router.query;

  const [communityId, setCommunityId] = useState(community);
  const [isShowingMoreMembers, setIsShowingMoreMembers] = useState(false);
  const [members, setMembers] = useState([]);
  const [communityInfo, setCommunityInfo] = useState({});

  function getCommunityInfoFromDato() {
    fetch('https://graphql.datocms.com/', {
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
            link,
            creatorSlug,
            createdAt,
            users {
              username
            }
          }
        }`,
      }),
    })
      .then((res) => res.json())
      .then((dataFromDato) => {
        const communityInfoFromDato = dataFromDato.data.community;
        setCommunityInfo({
          title: communityInfoFromDato.title,
          imageUrl: communityInfoFromDato.imageUrl,
          creatorSlug: communityInfoFromDato.creatorSlug,
          createdAt: communityInfoFromDato.createdAt,
        });
        setMembers(communityInfoFromDato.users);
        // setCommunityInfo(communityInfoFromDato);
      });
  }

  function handleJoinCommunity(e) {
    e.preventDefault();
    console.log('Oi');
  }

  useEffect(() => {
    getCommunityInfoFromDato();
  }, [communityId]);

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
              <a className="boxLink" href={`#`} target="_blank">
                {communityInfo.title}
              </a>
            </p>
            <hr />

            <AlurakutProfileSidebarMenuDefault
              handleJoinCommunity={handleJoinCommunity}
              isCommunityInfo
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
                {/* <tr>
                  <td className="textOnRight">idioma:</td>
                  <td>Português</td>
                </tr>
                <tr>
                  <td className="textOnRight">categoria:</td>
                  <td>Pessoas</td>
                </tr> */}
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
    </>
  );
}
