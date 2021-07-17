import styled from 'styled-components';

const Scrap = styled.li`
  display: flex;
  align-items: center;
  background-color: #d9e6f6;
  padding: 10px;

  &:first-child {
    margin-top: 24px;
    border-radius: 8px 8px 0 0;
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  }

  &:nth-child(even) {
    background-color: #f1f9fe;
  }

  a {
    display: inline-block;
    height: 102px;
    position: relative;
    overflow: hidden;
    border-radius: 8px;

    img {
      object-fit: cover;
      background-position: center center;
      width: 88px;
      height: 100%;
      position: relative;
    }
  }

  .githubLink {
    color: #333333;
    height: inherit;
    border-radius: inherit;
    text-decoration: none;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  p,
  span {
    font-size: 14px;
    margin-left: 20px;
  }

  span {
    color: #2e7bb4;
    font-weight: 600;
  }
`;

export default Scrap;
