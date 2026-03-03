# Frontend Setup - Adidas Jersey Store

Your frontend has been configured to match the FRONTEND_GUIDE.md. Follow these steps to get started.

## 1. Install Dependencies

Run the following command in your project root:

```bash
npm install
```

This will install `axios` and other dependencies needed for API integration.

## 2. Environment Configuration

A `.env.local` file has been created with the following configuration:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_NAME=Adidas Jersey Store
VITE_API_TIMEOUT=10000
```

For production, update these values accordingly.

## 3. Project Structure

Your project now includes:

### API Layer (`src/api/`)
- **client.js** - Axios client with interceptors for all API calls
- **leaguesApi.js** - League endpoints wrapper
- **clubsApi.js** - Club endpoints wrapper
- **jerseysApi.js** - Jersey endpoints wrapper (full CRUD)

### Redux Store (`src/store/slices/`)
- **leaguesSlice.js** - Leagues state management (list, detail, clubs, jerseys)
- **clubsSlice.js** - Clubs state management (list, detail, jerseys)
- **jerseysSlice.js** - Jerseys state management (list, detail, create, update, delete)
- **cartSlice.js** - Shopping cart (existing)
- **ordersSlice.js** - Orders management (existing)

### Custom Hooks (`src/hooks/`)
- **useJerseys.js** - Hook for fetching jerseys with filters
- **useJerseyDetail.js** - Hook for fetching single jersey details

## 4. Quick Start - Using the API

### Example 1: Display Jersey List

```javascript
import { useJerseys } from '../hooks/useJerseys';

export const JerseyPage = () => {
  const { jerseys, loading, error, pagination } = useJerseys({
    page: 1,
    limit: 20
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {jerseys.map(jersey => (
        <div key={jersey.jersey_id}>
          <h3>{jersey.name}</h3>
          <p>${jersey.price_usd}</p>
        </div>
      ))}
    </div>
  );
};
```

### Example 2: Fetch Jerseys with Filters

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { fetchJerseys } from '../store/slices/jerseysSlice';

const { jerseys, loading } = useSelector(state => state.jerseys);
const dispatch = useDispatch();

// Fetch filtered jerseys
dispatch(fetchJerseys({
  club_id: 1,
  type: 'home',
  in_stock: true,
  page: 1,
  limit: 20
}));
```

### Example 3: Get Jersey Detail

```javascript
import { useJerseyDetail } from '../hooks/useJerseyDetail';

export const JerseyDetailPage = ({ jerseyId }) => {
  const { jersey, loading, error } = useJerseyDetail(jerseyId);

  if (loading) return <div>Loading...</div>;
  if (!jersey) return <div>Jersey not found</div>;

  return (
    <div>
      <h1>{jersey.name}</h1>
      <p>Club: {jersey.club_name}</p>
      <p>League: {jersey.league_name}</p>
      <p>Price: ${jersey.price_usd}</p>
    </div>
  );
};
```

## 5. API Response Format

All API calls return data in this format:

```javascript
{
  success: true,
  data: [...],
  pagination: {
    page: 1,
    limit: 20,
    total: 100
  }
}
```

Error responses:

```javascript
{
  success: false,
  error: "Error message",
  details: [
    { field: "product_code", message: "5-20 characters required" }
  ]
}
```

## 6. Component Examples

See FRONTEND_GUIDE.md for complete examples of:
- Jersey list component with filters
- Jersey detail component
- Create/Update jersey forms
- Error handling patterns
- Pagination implementation

## 7. Next Steps

1. ✅ API client setup (Done)
2. ✅ Redux slices created (Done)
3. ✅ Custom hooks ready (Done)
4. ⏭️ Update existing components to use new slices
5. ⏭️ Create new pages/components as needed
6. ⏭️ Test API integration

## 8. Important Notes

- The API client uses axios interceptors for automatic request/response logging
- All responses pass through an interceptor that extracts `.data`
- Errors are automatically caught and logged to console
- Redux slices handle loading, error, and pagination state
- Environment variables are loaded from `.env.local`

## 9. Available Endpoints

See FRONTEND_GUIDE.md for detailed endpoint documentation:

### Leagues (4 endpoints)
- GET /api/leagues
- GET /api/leagues/:id
- GET /api/leagues/:id/clubs
- GET /api/leagues/:id/jerseys

### Clubs (3 endpoints)
- GET /api/clubs
- GET /api/clubs/:id
- GET /api/clubs/:id/jerseys

### Jerseys (5 endpoints) - CRUD
- GET /api/jerseys
- GET /api/jerseys/:id
- POST /api/jerseys
- PUT /api/jerseys/:id
- DELETE /api/jerseys/:id

---

Ready to start building! Run `npm install` and `npm run dev` to get started.
