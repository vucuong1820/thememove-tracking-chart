import { Card, DataTable, SkeletonDisplayText, SkeletonThumbnail } from '@shopify/polaris';
import React from 'react';
import styled from 'styled-components';

const skeletonRows = Array.from({ length: 8 }).map(() => [
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
]);

const TableWrapper = styled.div`
  .skeleton-item {
    & > div {
      margin-left: auto;
    }
  }
`;

function Table({ rows, loading }) {
  return (
    <Card.Section>
      <TableWrapper>
        <DataTable
          columnContentTypes={['text', 'numeric', 'numeric', 'numeric']}
          headings={['Name', 'All-time sales', 'Rating', 'Sales']}
          rows={loading ? skeletonRows : rows}
        />
      </TableWrapper>
    </Card.Section>
  );
}

export default Table;
