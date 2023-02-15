import dynamic from 'next/dynamic';
import styled from 'styled-components';

const LineChart = dynamic(() => import('@shopify/polaris-viz').then((module) => module.LineChart), { ssr: false });

const Container = styled.div`
  height: 100%;
  position: relative;
  div[data-tooltip='true'] {
    z-index: 99;
  }
`;
function PolarisLineChart(props) {
  return (
    <Container>
      <LineChart {...props} theme="Light" />;
    </Container>
  );
}

export default PolarisLineChart;
