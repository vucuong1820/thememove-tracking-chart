import { Card, DataTable, SkeletonDisplayText, SkeletonThumbnail } from '@shopify/polaris';
import React from 'react';
import styled from 'styled-components';

const skeletonRows = Array.from({ length: 5 }).map(() => [
  <SkeletonDisplayText key={1} />,
  <div className="skeleton-item" key={2}>
    <SkeletonThumbnail size="small" />
  </div>,
  <div className="skeleton-item" key={3}>
    <SkeletonThumbnail size="small" />
  </div>,
  <div className="skeleton-item" key={4}>
    <SkeletonThumbnail size="small" />
  </div>,
  <div className="skeleton-item" key={5}>
    <SkeletonThumbnail size="small" />
  </div>,
]);

const TableWrapper = styled.div`
  .Polaris-DataTable__Cell--header,
  .Polaris-DataTable__Cell {
    text-align: left;
  }
`;

function CompareTable({ rows, loading }) {
  return (
    <Card.Section>
      <TableWrapper>
        <DataTable
          columnContentTypes={['text', 'numeric', 'numeric', 'numeric']}
          headings={['Theme', 'All-time sales', 'Sales growth', 'Review growth', 'Rating']}
          rows={loading ? skeletonRows : rows}
        />
      </TableWrapper>
    </Card.Section>
  );
}

export default CompareTable;
