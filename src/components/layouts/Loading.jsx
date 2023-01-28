import { Spinner } from '@shopify/polaris';
import styled from 'styled-components';

const LoadingWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ScreenLoading = () => {
  return (
    <LoadingWrapper>
      <Spinner />
    </LoadingWrapper>
  );
};

const InnerLoading = ({ opacity = '0.5' }) => {
  return (
    <div
      style={{ paddingTop: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', background: `rgba(255, 255, 255, ${opacity})` }}
    >
      <Spinner size="small" />
    </div>
  );
};

const CenterLoading = ({ size = 'small', opacity = '0.5' }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        background: `rgba(255, 255, 255, ${opacity})`,
      }}
    >
      <Spinner size={size} />
    </div>
  );
};

const Loading = () => <></>;

Loading.Screen = ScreenLoading;
Loading.Inner = InnerLoading;
Loading.Center = CenterLoading;

export default Loading;
