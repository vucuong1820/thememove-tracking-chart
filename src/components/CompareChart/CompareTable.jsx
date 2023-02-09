import { Card, DataTable, Icon, SkeletonDisplayText, SkeletonThumbnail, TextStyle } from '@shopify/polaris';
import { ArrowDownMinor, ArrowUpMinor } from '@shopify/polaris-icons';
import { cloneDeep, isNil } from 'lodash';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import styled from 'styled-components';

const skeletonRows = Array.from({ length: 5 }).map(() => [
  <SkeletonDisplayText key={1} />,
  <div className="skeleton-item" key={2}>
    <SkeletonThumbnail size="small" />
  </div>,
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
  .Polaris-DataTable__Icon {
    opacity: 1;
    svg {
      fill: var(--p-icon);
    }
  }
  .Polaris-DataTable__Cell--header,
  .Polaris-DataTable__Heading {
    font-weight: var(--p-font-weight-medium);
  }
`;

const GrowthNumberContainer = styled.div`
  display: flex;
  align-items: center;
  .GrowthNumber__Value {
    margin-right: var(--p-space-2);
  }
  .Polaris-Icon {
    display: flex;
    align-items: center;
    margin: 0;
    width: unset;
    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

export default function CompareTable({ rows, loading }) {
  const router = useRouter();
  const [sortedRows, setSortedRows] = useState(null);

  const initialRows = useMemo(() => {
    if (loading) return [];
    return cloneDeep(rows).sort((a, b) => a[0].localeCompare(b[0]));
  }, [rows]);

  const tableRows = sortedRows ? sortedRows : initialRows;

  const handleSort = (index, direction) => {
    const newRows = sortedRows ? sortedRows : initialRows;
    setSortedRows(sortNumericData(tableRows, index, direction));
  };

  const dataTableRows = useMemo(() => {
    return cloneDeep(tableRows).map((row) => [
      <TextStyle key={1} variation={(router.query?.theme || 'MinimogWP') === row[0] ? 'strong' : ''}>
        {row[0]}
      </TextStyle>,
      ...cloneDeep(row.splice(1)).map((value, index) => {
        if (isNil(value?.value)) return value;
        return (
          <GrowthNumberContainer key={index}>
            <p className="GrowthNumber__Value">{value?.value}</p>
            <Icon color={value?.percentage > 0 ? 'success' : 'critical'} source={value?.percentage > 0 ? ArrowUpMinor : ArrowDownMinor} />
            <span>
              <TextStyle variation={value?.percentage > 0 ? 'positive' : 'negative'}>{value?.percentage}%</TextStyle>
            </span>
          </GrowthNumberContainer>
        );
      }),
    ]);
  }, [tableRows]);
  return (
    <Card.Section>
      <TableWrapper>
        <DataTable
          columnContentTypes={['text', 'numeric', 'numeric', 'numeric', 'numeric', 'numeric']}
          headings={['Heading', 'All-time sales', 'Sales growth', 'Total Reviews', 'Review growth', 'Rating']}
          rows={loading ? skeletonRows : dataTableRows}
          sortable={[false, true, true, true, true, true]}
          defaultSortDirection="descending"
          initialSortColumnIndex={4}
          onSort={handleSort}
          hoverable={false}
          firstColumnMinWidth={'200px'}

          // hasZebraStripingOnData
          // increasedTableDensity
        />
      </TableWrapper>
    </Card.Section>
  );

  function sortNumericData(rows, index, direction) {
    return [...rows].sort((rowA, rowB) => {
      const amountA = parseFloat(isNil(rowA[index]?.value) ? rowA[index] : rowA[index]?.value);
      const amountB = parseFloat(isNil(rowB[index]?.value) ? rowB[index] : rowB[index]?.value);

      return direction === 'descending' ? amountB - amountA : amountA - amountB;
    });
  }
}
