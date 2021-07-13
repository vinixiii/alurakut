import styled from 'styled-components';
import {
  AlurakutMenu,
  OrkutNostalgicIconSet,
} from '../src/lib/AlurakutCommons';

import MainGrid from '../src/components/MainGrid/index';
import Box from '../src/components/Box/index';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

export default function Home() {
  const githubUser = 'vinixiii';
  const amigos = [
    'omariosouto',
    'juunegreiros',
    'peas',
    'marcobrunodev',
    'rafaballerini',
    'felipefialho',
  ];

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profile-area" style={{ gridArea: 'profile-area' }}>
          <Box>
            <img
              src={`https://github.com/${githubUser}.png`}
              style={{ borderRadius: '8px' }}
            />
          </Box>
        </div>
        <div className="welcome-area" style={{ gridArea: 'welcome-area' }}>
          <Box>
            <h1 className="title">Bem-vindo(a)</h1>
            <OrkutNostalgicIconSet />
          </Box>
        </div>
        <div
          className="profile-relation-area"
          style={{ gridArea: 'profile-relation-area' }}
        >
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">Amigos ({amigos.length})</h2>
            <ul>
              {amigos.map((item) => {
                return (
                  <li>
                    <a href={`/users/${item}`} key={item}>
                      <img src={`https://github.com/${item}.png`} />
                      <span>{item}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
