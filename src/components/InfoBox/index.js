import styled from 'styled-components';

const InfoBox = styled.table`
  width: 100%;
  border-spacing: 0;
  margin-top: 24px;

  /* &:first-child {
    margin-top: 24px;
    border-radius: 8px 8px 0 0;
  }
  &:last-child {
    border-radius: 0 0 8px 8px;
  } */

  tr {
    background-color: #d9e6f6;
  }

  tr:nth-child(even) {
    background-color: #f1f9fe;
  }

  td {
    font-size: 14px;
    color: #333333;
    padding: 12px 6px;
  }

  .textOnRight {
    text-align: right;
    width: 50%;
  }
`;

export default InfoBox;
