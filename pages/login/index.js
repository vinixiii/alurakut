import React, { useState } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

export default function Login() {
  const router = useRouter();
  const [githubUser, setGithubUser] = useState('');
  const [userExist, setUserExist] = useState(true);

  function handleSignIn(e) {
    e.preventDefault();

    setUserExist(true);

    fetch('https://alurakut.vercel.app/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        githubUser: githubUser,
      }),
    }).then(async (res) => {
      const data = await res.json();

      const { isAuthenticated } = await fetch(
        'https://alurakut-vinixiii.vercel.app/api/auth',
        {
          headers: {
            Authorization: data.token,
          },
        }
      ).then((res) => res.json());

      if (isAuthenticated) {
        await getUsersFromDato();

        const userId = await getUserIdFromDato();

        nookies.set(null, 'token', data.token, {
          path: '/',
          maxAge: 86400 * 7,
        });

        nookies.set(null, 'userId', userId, {
          path: '/',
          maxAge: 86400 * 7,
        });

        router.push('/');
        return;
      }

      setUserExist(false);
    });
  }

  //Busca no DatoCMS todos os usuários e vê se o usuário
  //que está fazendo login já está cadastrado
  async function getUsersFromDato() {
    const { data } = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: 'a4f7abf1a97be84d00efed71df0b1c',
      },
      body: JSON.stringify({
        query: `query {
          allUsers(filter: { username: { in: ["${githubUser}"] } }) {
            id,
            username,
          }
        }`,
      }),
    }).then((res) => res.json());

    if (data.allUsers.length === 0) {
      const isCreated = await createNewUser(githubUser);

      if (isCreated) {
        return;
      }
    }

    return;
  }

  //Cadastra um novo Usuário
  async function createNewUser(newUser) {
    await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: newUser,
      }),
    });

    return true;
  }

  async function getUserIdFromDato() {
    const { data } = await fetch('https://graphql.datocms.com/', {
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
      .catch((err) => console.error(err));

    return data.user.id;
  }

  return (
    <main
      style={{
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="loginScreen">
        <section className="logoArea">
          <img src="https://alurakut.vercel.app/logo.svg" />

          <p>
            <strong>Conecte-se</strong> aos seus amigos e familiares usando
            recados e mensagens instantâneas
          </p>
          <p>
            <strong>Conheça</strong> novas pessoas através de amigos de seus
            amigos e comunidades
          </p>
          <p>
            <strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só
            lugar
          </p>
        </section>

        <section className="formArea">
          <form className="box" onSubmit={(e) => handleSignIn(e)}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input
              placeholder="Usuário"
              value={githubUser}
              onChange={(e) =>
                setGithubUser(e.target.value.trim().toLowerCase())
              }
            />
            {!userExist && (
              <span
                style={{ fontSize: '13px', color: 'red', marginBottom: '12px' }}
              >
                Este usuário é inválido! Tente novamente
              </span>
            )}
            <button type="submit">Login</button>
          </form>

          {/* <form className="box" onSubmit={(e) => handleRegister(e)}>
            <p>
              Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
            </p>
            <input
              placeholder="Usuário"
              value={githubUser}
              onChange={(e) => setGithubUser(e.target.value)}
            />
            {!userExist && (
              <span
                style={{ fontSize: '13px', color: 'red', marginBottom: '12px' }}
              >
                Este usuário é inválido! Tente novamente
              </span>
            )}
            <button type="submit">Cadastrar</button>
          </form> */}

          <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>ENTRAR JÁ</strong>
              </a>
            </p>
          </footer>
        </section>

        <footer className="footerArea">
          <p>
            © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> -{' '}
            <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> -{' '}
            <a href="/">Termos</a> - <a href="/">Contato</a>
          </p>
        </footer>
      </div>
    </main>
  );
}
