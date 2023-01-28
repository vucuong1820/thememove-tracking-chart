import styled from 'styled-components';

export const TooltipContainer = styled.div`
  padding: var(--p-space-2);
  background-color: var(--p-surface);
  .Tooltip__Percentage {
    display: flex;
    .Polaris-Icon {
      margin: 0;
    }
    font-size: 1rem;
  }
  .Tooltip__Item {
    display: flex;
    align-items: center;
    & > span {
      margin-right: var(--p-space-2);
    }
  }
`;
