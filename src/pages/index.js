import themeMoveThemes from '@constants/themes';
import { Layout, Link, Page, Stack } from '@shopify/polaris';
import { useRouter } from 'next/router';

function Home() {
  const router = useRouter();

  return (
    <Page title="ThemeMove Tracking Chart">
      <Layout>
        <div style={{ paddingLeft: '20px' }}>
          <Stack vertical>
            <Stack.Item>
              - Tracking charts for 45 active themes of ThemeMove: <br />
              <div style={{ paddingLeft: '8px' }}>{themeMoveThemes.map((theme) => theme?.name).join(', ')}</div>
            </Stack.Item>
            <Stack.Item>
              - These charts track <Link onClick={() => router.push('/overview')}>different themes with sales records</Link>,{' '}
              <Link onClick={() => router.push('/top-5')}>each theme with its competitors</Link> and{' '}
              <Link onClick={() => router.push('/category')}>several themes in the same category</Link>.
            </Stack.Item>
          </Stack>
        </div>
      </Layout>
    </Page>
  );
}

export default Home;
