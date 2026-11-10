import { render, screen, waitFor } from '@testing-library/react';
import ReviewSection from './components/core/HomePage/ReviewSection';
import { apiConnector } from './services/apiconnector';

jest.mock('./services/apiconnector', () => ({
  apiConnector: jest.fn(),
}));

jest.mock('./services/apis', () => ({
  ratingsEndpoints: {
    REVIEWS_DETAILS_API: '/reviews',
  },
}));

test('hides the review section when there are no valid reviews', async () => {
  apiConnector.mockResolvedValue({
    data: {
      success: true,
      data: [
        { rating: 0, review: '   ', user: { firstName: 'Jane', lastName: 'Doe' } },
        { rating: null, review: '', user: { firstName: 'John', lastName: 'Smith' } },
      ],
    },
  });

  render(<ReviewSection />);

  await waitFor(() => {
    expect(apiConnector).toHaveBeenCalled();
  });

  expect(screen.queryByText(/Reviews from other learners/i)).not.toBeInTheDocument();
});
