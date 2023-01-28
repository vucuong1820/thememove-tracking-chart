import { TextStyle } from '@shopify/polaris';
import dynamic from 'next/dynamic';
import styled from 'styled-components';

const LinePreview = dynamic(() => import('@shopify/polaris-viz').then((module) => module.LinePreview), { ssr: false });

const Container = styled.button`
  ${({ active }) => (active ? 'outline: 2px solid #4b92e5; outline-offset: 2px;' : 'outline: none !important;')}
  gap: 8px;
  background: rgb(246, 246, 247);
  padding: 6px 16px 6px 8px;
  border: none;
  border-radius: 2px;
  display: flex;
  align-items: center;
  cursor: pointer;
  .line-color {
    & > span {
      height: 12px !important;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
    }
  }
`;
function LegendItem({ data, styles, attributes, onSelect, selected = false }) {
  return (
    <Container className="legend-container" style={{ ...styles }} onClick={onSelect} active={selected}>
      <div className="line-color">
        <LinePreview color={data?.color} />
      </div>

      <TextStyle variation="subdued">{data?.name}</TextStyle>
    </Container>
  );
}

export default LegendItem;
