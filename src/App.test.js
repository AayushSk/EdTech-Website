import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ReviewSection from './components/core/HomePage/ReviewSection';
import { apiConnector } from './services/apiconnector';
import { deleteSection, updateSection } from './services/courseDetailsAPI';

jest.mock('./services/apiconnector', () => ({
  apiConnector: jest.fn(),
}));

jest.mock('./services/apis', () => ({
  ratingsEndpoints: {
    REVIEWS_DETAILS_API: '/reviews',
  },
  courseEndpoints: {
    UPDATE_SECTION_API: '/section/update',
    DELETE_SECTION_API: '/section/delete',
  },
}));

jest.mock('react-hot-toast', () => ({
  toast: {
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
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

test('authentication state has no bearer or localStorage JWT dependency', () => {
  const authSource = require('./slices/authSlice').default;
  const authInitialState = authSource(undefined, { type: '@@INIT' });

  expect(authInitialState).not.toHaveProperty('token');
  expect(authInitialState.isAuthenticated).toBe(false);
  expect(authInitialState.isSessionChecked).toBe(false);
});

test.each([
  ['updates', updateSection],
  ['deletes', deleteSection],
])('returns the updated course when a section %s', async (_action, sectionMutation) => {
  const updatedCourse = { _id: 'course-1', courseContent: [] };
  apiConnector.mockReset();
  apiConnector.mockResolvedValue({
    data: { success: true, updatedCourse },
  });

  await expect(sectionMutation({ courseId: 'course-1' }, 'token')).resolves.toEqual(
    updatedCourse
  );
});
