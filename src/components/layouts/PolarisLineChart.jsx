import dynamic from 'next/dynamic';

const LineChart = dynamic(() => import('@shopify/polaris-viz').then((module) => module.LineChart), { ssr: false });

function PolarisLineChart(props) {
  return <LineChart {...props} theme="Light" />;
}

export default PolarisLineChart;
