import CompareChart from '@components/CompareChart';
import { compareThemes } from '@constants/themes';
import { FormLayout, Page, TextStyle } from '@shopify/polaris';
import { cloneDeep } from 'lodash';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

function View() {
  const router = useRouter();
  const params = new URLSearchParams(location);

  const themeListCompare = useMemo(() => {
    const theme = router.query?.theme || 'MinimogWP';
    return compareThemes?.[theme];
  }, [params]);

  return (
    <Page fullWidth>
      <div style={{ marginBottom: 'var(--p-space-8)' }}>
        <TextStyle>
          Tracking theme: <TextStyle variation="strong">{router.query?.theme || 'MinimogWP'}</TextStyle>
        </TextStyle>
      </div>
      <FormLayout>
        <CompareChart showLineChart={false} themeList={themeListCompare} />
        <CompareChart showTable={false} themeList={themeListCompare} />
      </FormLayout>
    </Page>
  );
}

export default View;
