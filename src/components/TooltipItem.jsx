import { Stack, TextStyle } from '@shopify/polaris';
import dynamic from 'next/dynamic';
const SquareColorPreview = dynamic(() => import('@shopify/polaris-viz').then((module) => module.SquareColorPreview), { ssr: false });

function TooltipItem({ data }) {
  return (
    <Stack.Item>
      <div className="Tooltip__Item">
        <SquareColorPreview color={data?.color} />
        <TextStyle variation="strong">
          {data?.key} : {data?.value}
        </TextStyle>
      </div>
    </Stack.Item>
  );
}

export default TooltipItem;
