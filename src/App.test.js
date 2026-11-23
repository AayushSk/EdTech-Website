import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  apiConnector.mockReset();
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
  await act(async () => {
    await Promise.resolve();
  });
  expect(screen.queryByText(/Reviews from other learners/i)).not.toBeInTheDocument();
});

test('loads the next review page using the returned cursor', async () => {
  apiConnector.mockReset();
  apiConnector
    .mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          { rating: 5, review: 'First review', user: {}, course: {} },
        ],
        pagination: { hasNextPage: true, nextCursor: 'cursor-1', limit: 10 },
      },
    })
    .mockResolvedValueOnce({
      data: {
        success: true,
        data: [
          { rating: 4, review: 'Second review', user: {}, course: {} },
        ],
        pagination: { hasNextPage: false, nextCursor: null, limit: 10 },
      },
    });

  render(<ReviewSection />);

  const loadMoreButton = await screen.findByRole('button', { name: /load more reviews/i });
  await act(async () => {
    fireEvent.click(loadMoreButton);
    await Promise.resolve();
  });

  await waitFor(() => {
    expect(screen.getByText('Second review')).toBeInTheDocument();
  });
  expect(apiConnector.mock.calls[0][4]).toEqual({ limit: 10 });
  expect(apiConnector.mock.calls[1][4]).toEqual({ limit: 10, cursor: 'cursor-1' });
});
