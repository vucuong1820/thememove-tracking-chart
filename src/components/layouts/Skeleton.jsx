import { SkeletonDisplayText } from '@shopify/polaris';
import styled from 'styled-components';

const SkeletonStyle = styled.div`
  display: block !important;
  width: ${(props) => props.width}px;
  ${(props) => props.style};
  .Polaris-SkeletonDisplayText__DisplayText {
    width: 100%;
    height: ${(props) => props.height}px;
    max-width: 100%;
  }
`;

const Skeleton = ({ width = 100, height = 32, style }) => {
  return (
    <SkeletonStyle width={width} height={height} style={style}>
      <SkeletonDisplayText />
    </SkeletonStyle>
  );
};

export default Skeleton;
