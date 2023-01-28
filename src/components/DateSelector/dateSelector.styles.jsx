import styled from 'styled-components';

export const DateWrapper = styled.div`
  display: flex;
  width: ${({ expand }) => (expand ? '800px' : '400px')};
  gap: 3rem;
  .compare-date {
    display: flex;
    align-items: flex-end;
  }
`;
