import React, { useState } from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

import { useUserId } from '../../src/hooks/useUserId';

export default function Login() {
  const router = useRouter();

  const [githubUser, setGithubUser] = useState('');
  const [userExist, setUserExist] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  function handleSignIn(e) {
    e.preventDefault();

    setUserExist(true);
    setIsLoading(true);

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

        const userId = await useUserId(githubUser);

        setIsLoading(false);

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

      setIsLoading(false);
      setUserExist(false);
    });
  }

  //Busca no DatoCMS todos os usuários e vê se o usuário
  //que está fazendo login já está cadastrado
  async function getUsersFromDato() {
    const userId = await useUserId(githubUser);

    if (userId === null) {
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
            <button type="submit" disabled={isLoading ? true : false}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* <footer className="box">
            <p>
              Ainda não é membro? <br />
              <a href="/login">
                <strong>CADASTRE-SE JÁ</strong>
              </a>
            </p>
          </footer> */}
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
