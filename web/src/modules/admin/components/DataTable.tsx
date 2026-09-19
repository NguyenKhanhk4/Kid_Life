import { ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  onNextPage?: () => void;
  hasMore?: boolean;
}

export default function DataTable<T extends { _id?: string; id?: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  onNextPage,
  hasMore
}: DataTableProps<T>) {
  
  if (loading && data.length === 0) {
    return (
      <div className="admin-table-container" style={{ padding: 24 }}>
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="admin-skeleton" style={{ height: 48, marginBottom: 12 }}></div>
        ))}
      </div>
    );
  }

  return (
    <div className="admin-table-container">
      <div style={{ overflowX: 'auto' }}>
        <table className="admin-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: 48, color: 'var(--admin-muted)' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr key={row._id || row.id || idx}>
                  {columns.map(col => (
                    <td key={col.key}>
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {hasMore && onNextPage && (
        <div style={{ padding: 16, textAlign: 'center', borderTop: '1px solid var(--admin-border)' }}>
          <button className="admin-btn admin-btn-outline" onClick={onNextPage}>
            Tải thêm dữ liệu
          </button>
        </div>
      )}
    </div>
  );
}
