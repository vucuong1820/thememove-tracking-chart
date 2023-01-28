import { Card, EmptyState, Page } from '@shopify/polaris';
import NotFoundImage from 'public/empty-state.svg';

export default function NotFound() {
  return (
    <Page fullWidth>
      <Card>
        <Card.Section>
          <EmptyState heading="There is no page at this address" image={NotFoundImage?.src}>
            <p>Check the URL and try again, or use the search bar to find what you need.</p>
          </EmptyState>
        </Card.Section>
      </Card>
    </Page>
  );
}
