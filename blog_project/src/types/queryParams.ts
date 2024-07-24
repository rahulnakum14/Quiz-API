/**
 * Interface representing query parameters for filtering and pagination.
 * @interface queryParamsAttributes
 * @property {string} [page] - The page number for pagination.
 * @property {string} [limit] - The maximum number of items per page.
 * @property {string} [sortBy] - The field to sort the results by.
 * @property {string} [sortOrder] - The order in which to sort the results (ascending or descending).
 * @property {string} [search] - The search query to filter results.
 */
interface queryParamsAttributes {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}

export default queryParamsAttributes;
